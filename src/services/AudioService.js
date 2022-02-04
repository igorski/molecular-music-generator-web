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
import * as Tone from "tone";
import { getMeasureDurationInSeconds } from "../utils/AudioMath";

const initializeCallbacks = [];
let initialized = false;
const parts = [];
let sequence = null;
let limiter = null;
let synth = null;
let notes = [];

/**
 * AudioContext can only be started after a user interaction.
 * In this method we will automatically start the context when any
 * kind of interaction has occurred in the document.
 */
export const init = () => {
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

    // lazily create a limiter

    if ( !limiter ) {
        limiter = new Tone.Limiter( -20 ).toDestination();
    }

    // create a polyphonic synthesizer for playback

    synth = new Tone.PolySynth( Tone.AMSynth ).connect( limiter );
    synth.set({ harmonicity: 2 });

    // prepare notes for playback in tone.js

    const measureDuration = getMeasureDurationInSeconds( composition.tempo, composition.beatAmount );

    notes = composition.tracks
        .flatMap(({ notes }) => notes )
        .map( note => {
            return {
                note     : `${note.note}${note.octave}`,
                duration : note.duration,
                offset   : note.offset - ( measureDuration * note.measure ),
                measure  : note.measure
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
    synth?.disconnect();
    sequence?.stop();
    sequence?.dispose();
    Tone.Transport.stop();
}

function stopPlayingParts() {
    for ( const part of parts ) {
        part.stop();
        part.dispose();
    }
    parts.length = 0;
}

function enqueueNextMeasure( measureNum, delta = 0 ) {
    const notesToEnqueue = notes.filter(({ measure }) => measure === measureNum );
    if ( !notesToEnqueue.length ) {
        return;
    }
    parts.push( new Tone.Part(( time, value ) => {
        synth.triggerAttackRelease( value.note, value.duration, time );
    }, notesToEnqueue.map( note => ({
        ...note,
        // use an array of objects as long as the object has a "time" attribute
        time : note.offset + delta//( Tone.now() + note.offset ) + delta
    })) ).start());
}
