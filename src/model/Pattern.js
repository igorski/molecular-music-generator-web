/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Igor Zinken
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
export default class Pattern
{
    constructor( notes, patternNum, offset ) {
        this.notes      = notes;      // all the notes within the pattern
        this.patternNum = patternNum; // the number of this pattern within the total sequence
        this.offset     = offset;     // the start offset of the pattern
    }

    offsetConflictsWithPattern( compareNote ) {
        const noteOffsets = this.getNoteOffsets();

        for ( const noteOffset of noteOffsets ) {
            const actualOffset = noteOffset - this.offset;
            if ( actualOffset === 0 ) {
                if ( actualOffset === compareNote ) {
                    return  true;
                }
            } else if ( compareNote % actualOffset === 0 ) {
                return true;
            }
        }
        return false;
    }

    getNoteOffsets() {
        return this.notes.map(({ offset }) => offset );
    }

    getRangeStartOffset() {
        return this.notes[ 0 ]?.offset ?? 0;
    }

    getRangeEndOffset() {
        if ( this.notes.length > 0 ) {
            const lastNote = this.notes[ this.notes.length - 1 ];
            return lastNote.offset + lastNote.duration;
        }
        return 0;
    }

    getRangeLength() {
        return this.getRangeEndOffset() - this.getRangeStartOffset();
    }
}
