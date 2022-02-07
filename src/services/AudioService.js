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
import { getMeasureDurationInSeconds } from "../utils/AudioMath";
import { getFrequency } from "../utils/PitchUtil";

const initializeCallbacks = [];
let Tone;
let initialized = false;
const parts = [];
const envelopes = [];
const oscillators = [];
let sequence = null;
let limiter = null;
let comp = null;
let notes = [];

const MAX_POLYPHONY = 30;

/**
 * AudioContext can only be started after a user interaction.
 * In this method we will automatically start the context when any
 * kind of interaction has occurred in the document.
 */
export const init = async () => {
    Tone = await import( "tone" );
    const events = [ "click", "touchstart", "keydown" ];
    const handler = async () => {
        await Tone.start();
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
export const play = () => Tone.Transport.start();

/**
 * Halts playback of the composition
 */
export const pause = () => Tone.Transport.pause();

/**
 * Jump to a specific measure in the composition
 */
export const goToMeasure = measureNum => {
    stopPlayingParts();
    Tone.Transport.position = `${measureNum}:0:0`;
    enqueueNextMeasure( measureNum );

    return { measure: measureNum, beat: 0, sixteenths: 0 };
};

/**
 * Set up a Synth and Transport within tone.js to play back given composition
 */
export const setupCompositionPlayback = ( composition, sequencerCallback ) => {
    if ( !initialized ) {
        initializeCallbacks.push( setupCompositionPlayback.bind( this, composition, sequencerCallback ));
        return;
    }

    reset();

    // lazily create a compressor and limiter to keep all levels in check

    if ( !limiter ) {
        limiter = new Tone.Limiter( -20 ).toDestination();
        comp = new Tone.Compressor( -30, 3 ).connect( limiter );
    }

    // prepare notes for playback in tone.js

    const measureDuration = getMeasureDurationInSeconds( composition.tempo, composition.beatAmount );

    notes = composition.tracks
        .flatMap(({ notes }) => notes )
        .map( note => {
            return {
                ...note,
                offset : note.offset - ( measureDuration * note.measure ),
            };
    });

    // set up Transport

    Tone.Transport.timeSignature = [ composition.beatAmount, composition.beatUnit ];
    Tone.Transport.bpm.value = composition.tempo;

    // set a callback that enqueues the next measure on the first beat of a new bar

    sequence = new Tone.Sequence(( time ) => {
        const [ bars, beats, sixteenths ] = Tone.Transport.position.split( ":" ).map( parseFloat );
        sequencerCallback?.(
            bars, beats, sixteenths, composition.totalMeasures, time
        );
        //console.warn( Tone.Transport.position );
        if ( beats === 0 && Math.floor( sixteenths ) === 0 ) {
            enqueueNextMeasure( bars );
        }
    }, [ "C3" ],  measureDuration / composition.beatAmount ).start( 0 );
};

/* internal methods */

function reset() {
    stopPlayingParts();
    sequence?.stop();
    sequence?.dispose();
    Tone.Transport.stop();
}

function stopPlayingParts() {
    for ( const part of parts ) {
        part.stop();
        part.dispose();
    }
    for ( const envelope of envelopes ) {
        envelope.dispose();
    }
    for ( const oscillator of oscillators ) {
        oscillator.stop();
        oscillator.dispose();
    }
    parts.length = 0;
    envelopes.length = 0;
    oscillators.length = 0;
}

function enqueueNextMeasure( measureNum, delta = 0 ) {
    // note we enqueue the notes in reverse as we want to cap max polyphony by
    // excluding the oldest patterns
    const notesToEnqueue = notes.filter(({ measure }) => measure === measureNum ).reverse();
    if ( !notesToEnqueue.length ) {
        return;
    }
    if ( notesToEnqueue.length > MAX_POLYPHONY ) {
        notesToEnqueue.splice( 0, MAX_POLYPHONY );
    }
    parts.push( new Tone.Part(( time, value ) => {

        // we use simple envelopes and oscillators instead of the Tonejs synths
        // as they suffer from max polyphony and performance issues on less powerful configurations

        const envelope = new Tone.AmplitudeEnvelope({
            attack: 0.05,
            decay: 0.5,
            sustain: 0.2,
            release: 0.1
        });
        envelope.connect( comp );

        const oscillator = new Tone.Oscillator(
            getFrequency( value.note, value.octave ), "sawtooth19"
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
