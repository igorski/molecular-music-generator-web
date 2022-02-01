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
import midiWriter from "midi-writer-js";
import { getMeasureDurationInSeconds } from "../utils/AudioMath";

export const createMIDI = composition => {

    const midiTracks = [];

    composition.tracks.forEach(({ name }) => {
        const track = new midiWriter.Track();
        track.setTempo( composition.tempo );
        track.addTrackName( name );
        track.setTimeSignature( composition.beatAmount, composition.beatUnit );
        midiTracks.push( track );
    });

    // all measures have the same duration
    const measureDuration = getMeasureDurationInSeconds( composition.tempo, composition.beatAmount );
    // we specify event ranges in ticks (128 ticks == 1 beat)
    const TICKS = ( 128 * composition.beatAmount ) / measureDuration; // ticks per measure

    // walk through all patterns
    composition.tracks.forEach(( track, trackIndex ) => {
        const midiTrack = midiTracks[ trackIndex ];
        track.notes.forEach(({ note, octave, offset, duration }) => {
            midiTrack.addEvent(
                new midiWriter.NoteEvent({
                    pitch     : `${note}${octave}`,
                    duration  : `T${Math.round( duration * TICKS )}`,
                    startTick : Math.round( offset * TICKS )
                })
            );
        });
    });
    return ( new midiWriter.Writer( midiTracks )).dataUri();
};
