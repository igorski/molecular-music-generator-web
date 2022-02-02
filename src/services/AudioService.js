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

const initializeCallbacks = [];
let initialized = false;
let sequencerCallback = null;
let part = null;
let sequence = null;

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

export const setSequencerCallback = callback => sequencerCallback = callback;

export const goToMeasure = measureNum => Tone.Transport.position = `${measureNum}:0:0`;

export const createSynth = composition => {
    if ( !initialized ) {
        initializeCallbacks.push( createSynth.bind( this, composition ));
        return;
    }

    // create an FM synth for playback

    const synth = new Tone.PolySynth( Tone.FMSynth ).toDestination();
    const now   = Tone.now();

    if ( part ) {
        part.stop();
        sequence.stop();
        sequence.dispose();
        Tone.Transport.stop();
    }

    // prepare notes for playback in tone.js

    const notes = composition.tracks
        .flatMap(({ notes }) => notes )
        .map( track => {
            return {
                note     : `${track.note}${track.octave}`,
                duration : track.duration,
                time     : track.offset
            };
    });

    // enqueue all notes in the composition

    part = new Tone.Part(( time, value ) => {
        synth.triggerAttackRelease( value.note, value.duration, now + value.time );
    }, notes ).start( 0 );

    // set a callback that fires upon playback completion of every beat

    sequence = new Tone.Sequence(( time ) => {
        const [ bars, beats, sixteenths ] = Tone.Transport.position.split( ":" ).map( parseFloat );
        sequencerCallback?.(
            bars, beats, sixteenths, composition.totalMeasures, time
        );
    }, [ "C3" ], `${composition.beatAmount}n` ).start( 0 );

    // start all

    Tone.Transport.start();
    Tone.Transport.bpm.value = composition.tempo;
};
