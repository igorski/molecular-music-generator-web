/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2022 Igor Zinken
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
import { CompositionSource } from "../interfaces/CompositionSource";
import Pattern from "../model/Pattern";
import Note from "../model/Note";
import Composition from "../model/Composition";
import { getMeasureDurationInSeconds } from "../utils/AudioMath";

export const createComposition = ( props: CompositionSource ): Composition => {

    const out: Composition = new Composition(
        props.timeSigBeatAmount,
        props.timeSigBeatUnit,
        props.tempo,
        props.patternLength,
        props.patternAmount
    );

    // --- COMPOSITION

    let pattern = new Pattern( "melody" );
    out.patterns.push( pattern );

    let currentPosition   = 0;
    let currentBarLength  = 0;
    let noteLength = props.note1Length;

    const patterns: Array<Pattern> = [];
    let notes: Array<Note> = [];

    // pre calculate all pitches

    const scale    = props.scale.split( "," ).map( pitch => pitch.trim() );
    const pitches  = [];
    const maxIndex = scale.length - 1;
    let octave = props.octaveLower;

    for ( let i = 0, l = scale.length; i < l; ++i ) {
        const note = scale[ i ];
        pitches.push({ note, octave });

        // reached end of the note list ? increment octave

        if ( i === maxIndex && octave < props.octaveUpper ) {
            i = -1; // restart note generation for next octave
            ++octave;
        }
    }

    // create patterns from all available pitches

    const MEASURE = getMeasureDurationInSeconds( out.tempo, out.beatAmount );
    const BEAT    = MEASURE / out.beatUnit;
    const PATTERN_LENGTH = Math.ceil( props.patternLength / out.beatUnit );

    let currentPattern: Pattern = new Pattern( pattern.name, notes, 0, currentPosition );

    for ( let i = 0, l = pitches.length; i < l; ++i ) {

        const pitch = pitches[ i ];

        // swap note length if there is a conflict with a previously added note in another pattern

        if ( offsetConflictsWithPattern( currentPosition - currentPattern.offset, patterns )) {
            if ( noteLength === props.note1Length ) {
                noteLength = props.note2Length;
            } else {
                noteLength = props.note1Length;
            }
        }

        // create new note

        const note: Note = new Note(
            pitch.note, pitch.octave, currentPosition, noteLength * BEAT,
            Math.floor( currentPosition / MEASURE )
        );

        // add note to list (so it can be re-added in next iterations)

        notes.push( note );

        // update current sequence position

        currentPosition  += note.duration;
        currentBarLength += note.duration;

        // pattern switch ? make it so (this starts the interleaving of the notes and thus, the magic!)

        if (( currentBarLength / MEASURE ) >= PATTERN_LENGTH ) {
            patterns.push( currentPattern );

            // store current notes in new pattern
            notes          = [];
            currentPattern = new Pattern( pattern.name, notes, patterns.length, currentPosition );

            currentBarLength = 0;
        }

        // break the loop when we've rendered the desired amount of patterns

        if ( patterns.length >= props.patternAmount ) {
            break;
        }

        // if we have reached the end of the pitch range, start again
        // from the beginning until we have rendered all the patterns

        if ( i === ( l - 1 )) {
            pitches.reverse(); // go down the scale
            i = -1;
        }
    }

    const totalLength = currentPosition;

    // loop all patterns to fit song length, add their notes to the current pattern

    for ( const comparePattern of patterns ) {
        let patternLength = 0;
        while ( patternLength < ( totalLength - pattern.offset )) {
            for ( const note of comparePattern.notes ) {
                const offset = note.offset + patternLength;
                pattern.notes.push({
                    ...note,
                    offset,
                    measure : Math.floor( offset / MEASURE )
                });
            }
            patternLength += comparePattern.getRangeLength();
        }

        // create new pattern for next sequence, if specified

        if ( props.uniqueTrackPerPattern ) {
            pattern = new Pattern( "melody" );
            out.patterns.push( pattern );
        }
    }
    return out;
}

/* internal methods */

function offsetConflictsWithPattern( noteOffset: number, patterns: Array<Pattern> ): boolean {
    for ( const pattern of patterns ) {
        if ( pattern.notes.length > 0 &&
             pattern.offsetConflictsWithPattern( noteOffset )) {
            return true;
        }
    }
    return false;
}
