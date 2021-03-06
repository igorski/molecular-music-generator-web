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
export default class Note {
    note     : string;
    octave   : number;
    offset   : number;
    duration : number;
    measure  : number;

    constructor( note: string, octave: number, offset: number, duration: number, measure: number ) {
        this.note      = note;
        this.octave    = octave;
        this.offset    = offset;    // offset within the sequence
        this.duration  = duration;  // length of the note
        this.measure   = measure;   // measure the Note belongs to
    }

    clone(): Note {
        return new Note( this.note, this.octave, this.offset, this.duration, this.measure );
    }

    equals( compareNote: Note ): boolean {
        if ( compareNote === this ) {
            return true;
        }
        
        return compareNote.note     === this.note &&
               compareNote.octave   === this.octave &&
               compareNote.offset   === this.offset &&
               compareNote.duration === this.duration &&
               compareNote.measure  === this.measure;
    }

    overlaps( compareNote: Note ): boolean {
        if ( compareNote === this ) {
            return false;
        }

        return compareNote.note     === this.note &&
               compareNote.octave   === this.octave &&
               compareNote.offset   === this.offset &&
               compareNote.measure  === this.measure;
    }
}
