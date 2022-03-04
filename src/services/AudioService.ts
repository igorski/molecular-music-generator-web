/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Igor Zinken
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
import type Tone from "tone/build/esm/index.d";
import Composition from "../model/Composition";
import Note from "../model/Note";
import { getMeasureDurationInSeconds } from "../utils/AudioMath";
import { getFrequency } from "../utils/PitchUtil";

const initializeCallbacks: Array<Function> = [];
let ToneAPI: typeof Tone = null;
let initialized: boolean = false;

const parts: Array<Tone.Part> = [];
const envelopes: Array<Tone.AmplitudeEnvelope> = [];
const oscillators: Array<Tone.Oscillator> = [];
let sequence: Tone.Sequence = null;
let limiter: Tone.Limiter = null;
let eq: Tone.EQ3 = null;
let comp: Tone.Compressor = null;
let notes: Array<Note> = [];

const MAX_POLYPHONY = 30;

/**
 * AudioContext can only be started after a user interaction.
 * In this method we will automatically start the context when any
 * kind of interaction has occurred in the document.
 */
export const init = async () => {
    ToneAPI = ( await import( "tone" ) as typeof Tone );
    const events: Array<string> = [ "click", "touchstart", "keydown" ];
    const handler = async () => {
        await ToneAPI.start();
        initialized = true;
        events.forEach( event => {
            document.body.removeEventListener( event, handler, false );
        });
        while ( initializeCallbacks.length ) {
            initializeCallbacks.shift()();
        }
    };
    events.forEach( event => {
        document.body.addEventListener( event, handler, false );
    });
};

/**
 * Start playback of the composition
 */
export const play = (): typeof Tone.Transport => ToneAPI.Transport.start();

/**
 * Halts playback of the composition
 */
export const pause = (): typeof Tone.Transport => ToneAPI.Transport.pause();

/**
 * Jump to a specific measure in the composition
 */
export const goToMeasure = ( measureNum: number ): { measure: number, beat: number, sixteenths: number }  => {
    stopPlayingParts();
    ToneAPI.Transport.position = `${measureNum}:0:0`;
    enqueueNextMeasure( measureNum );

    return { measure: measureNum, beat: 0, sixteenths: 0 };
};

/**
 * Set up a Synth and Transport within tone.js to play back given composition
 */
export const setupCompositionPlayback = ( composition: Composition, sequencerCallback: Function ): void => {
    if ( !initialized ) {
        initializeCallbacks.push( setupCompositionPlayback.bind( this, composition, sequencerCallback ));
        return;
    }

    reset();

    // lazily create a compressor and limiter to keep all levels in check

    if ( !limiter ) {
        limiter = new ToneAPI.Limiter( -20 ).toDestination();
        comp = new ToneAPI.Compressor( -40, 3 ).connect( limiter );
        eq = new ToneAPI.EQ3({
            low  : -3,
            mid  : 0,
            high : -10,
            lowFrequency  : 40,
            highFrequency : 6000
        }).connect( comp );
    }

    // prepare notes for playback in tone.js

    const measureDuration: number = getMeasureDurationInSeconds( composition.tempo, composition.beatAmount );

    notes = composition.patterns
        .flatMap(({ notes }) => notes )
        .map(( note: Note ) => {
            const clone = note.clone();
            clone.offset = note.offset - ( measureDuration * note.measure );
            return clone;
        });

    // set up Transport

    ToneAPI.Transport.timeSignature = [ composition.beatAmount, composition.beatUnit ];
    ToneAPI.Transport.bpm.value = composition.tempo;

    // set a callback that enqueues the next measure on the first beat of a new bar

    sequence = new ToneAPI.Sequence(( time ) => {
        const [ bars, beats, sixteenths ] = ( ToneAPI.Transport.position as string ).split( ":" ).map( parseFloat );
        sequencerCallback?.(
            bars, beats, sixteenths, composition.totalMeasures, time
        );
        //console.warn( Tone.Transport.position );
        if ( beats === 0 && Math.floor( sixteenths ) === 0 ) {
            enqueueNextMeasure( bars );
        }
    }, [ "C3" ], measureDuration / composition.beatAmount ).start( 0 );
};

/* internal methods */

function reset(): void {
    stopPlayingParts();
    sequence?.stop();
    sequence?.dispose();
    ToneAPI.Transport.stop();
}

function stopPlayingParts(): void {
    resetActors( parts );
    resetActors( envelopes );
    resetActors( oscillators );
}

function resetActors( actorList: Array<Tone.ToneEvent|Tone.Envelope|Tone.Oscillator> ): void {
    for ( const actor of actorList ) {
        if ( actor instanceof ToneAPI.Oscillator ) {
            actor.stop();
        }
        actor.dispose();
    }
    actorList.length = 0;
}

function enqueueNextMeasure( measureNum: number, delta: number = 0 ): void {
    // note we enqueue the notes in reverse as we want to cap max polyphony by
    // excluding the oldest patterns
    const notesToEnqueue = notes.filter(({ measure }) => measure === measureNum ).reverse();
    if ( !notesToEnqueue.length ) {
        return;
    }
    if ( notesToEnqueue.length > MAX_POLYPHONY ) {
        notesToEnqueue.splice( 0, MAX_POLYPHONY );
    }
    parts.push( new ToneAPI.Part(( time, value ) => {

        // we use simple envelopes and oscillators instead of the Tonejs synths
        // as they suffer from max polyphony and performance issues on less powerful configurations

        const envelope = new ToneAPI.AmplitudeEnvelope({
            attack  : 0.2,
            decay   : 0.5,
            sustain : 0.2,
            release : 0.1
        });
        envelope.connect( eq );

        const oscillator = new ToneAPI.Oscillator(
            getFrequency( value.note, value.octave ), "sawtooth"
        ).start( time ).stop( time + value.duration );

        oscillator.connect( envelope )
        envelope.triggerAttackRelease( value.duration, time );

        oscillators.push( oscillator );
        envelopes.push( envelope );

    }, notesToEnqueue.map( note => ({
        ...note,
        // use an array of objects as long as the object has a "time" attribute
        time : note.offset + delta//( Tone.now() + note.offset ) + delta
    })) ).start());
}
