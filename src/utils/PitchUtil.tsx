/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2016-2022 - https://www.igorski.nl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * order of note names within a single octave
 */
export const OCTAVE_SCALE: Array<string> = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];

/**
 * @param {string} aNote - musical note to return ( A, B, C, D, E, F, G with
 *               possible enharmonic notes ( 'b' meaning 'flat', '#' meaning 'sharp' )
 *               NOTE: flats are CASE sensitive ( to prevent seeing the note 'B' instead of 'b' )
 * @param {number} aOctave - the octave to return ( accepted range 0 - 9 )
 * @return {number} containing exact frequency in Hz for requested note
 */
export const getFrequency = ( aNote: string, aOctave: number ): number => {
    let freq;
    let enharmonic = 0;

    // detect flat enharmonic
    let i = aNote.indexOf( "b" );
    if ( i > -1 ) {
        aNote = aNote.substr( i - 1, 1 );
        enharmonic = -1;
    }

    // detect sharp enharmonic
    i = aNote.indexOf( "#" );
    if ( i > -1 ) {
        aNote = aNote.substr( i - 1, 1 );
        enharmonic = 1;
    }

    freq = getOctaveIndex( aNote, enharmonic );

    if ( aOctave === 4 ) {
        return freq;
    }
    else {
        // translate the pitches to the requested octave
        const d = aOctave - 4;
        let j = Math.abs( d );

        for ( i = 0; i < j; ++i ) {
            if ( d > 0 ) {
                freq *= 2;
            }
            else {
                freq *= 0.5;
            }
        }
        return freq;
    }
};

/* internal methods */

/**
 * pitch table for all notes from C to B at octave 4
 * which is used for calculating all pitches at other octaves
 */
const OCTAVE: Array<number> = [
    261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995, 415.305, 440, 466.164, 493.883
];

/**
 * retrieves the index in the octave array for a given note
 * modifier enharmonic returns the previous ( for a 'flat' note )
 * or next ( for a 'sharp' note ) index
 *
 * @param {string} aNote ( A, B, C, D, E, F, G )
 * @param {number=} aEnharmonic optional, defaults to 0 ( 0, -1 for flat, 1 for sharp )
 * @return {number}
 */
function getOctaveIndex( aNote: string, aEnharmonic?: number ): number {
    if ( typeof aEnharmonic !== "number" ) {
        aEnharmonic = 0;
    }

    for ( let i = 0, j = OCTAVE.length; i < j; ++i ) {
        if ( OCTAVE_SCALE[ i ] === aNote ) {
            let k = i + aEnharmonic;

            if ( k > j ) {
                return OCTAVE[ 0 ];
            }
            if ( k < 0 ) {
                return OCTAVE[ OCTAVE.length - 1 ];
            }
            return OCTAVE[ k ];
        }
    }
    return NaN;
}
