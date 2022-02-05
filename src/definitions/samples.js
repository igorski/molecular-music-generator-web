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
export const DEFAULT_COMPOSITION = {
    name: "Default",
    description: "Something to set the mood. Ascending the C minor scale.",
    timeSigBeatAmount: 4,
    timeSigBeatUnit  : 4,
    tempo: 120,
    scale: "C, D, D#, F, G, G#, A#",
    note1Length: 2,
    note2Length: 0.5,
    patternLength: 4,
    patternAmount: 8,
    octaveLower: 2,
    octaveUpper: 7,
    uniqueTrackPerPattern: false
};

export const COMPOSITIONS = [
    DEFAULT_COMPOSITION,
    {
        name: "4E3",
        description: "By Duncan Lockerby. C major starting on E.",
        timeSigBeatAmount: 4,
        timeSigBeatUnit  : 4,
        tempo: 120,
        scale: "E, F, G, A, B, C, D",
        note1Length: 4,
        note2Length: 3,
        patternLength: 4,
        patternAmount: 8,
        octaveLower: 2,
        octaveUpper: 7,
        uniqueTrackPerPattern: false
    },
    {
        name: "10 G 3.5",
        description: "By Duncan Lockerby. C major starting on G.",
        timeSigBeatAmount: 4,
        timeSigBeatUnit  : 4,
        tempo: 120,
        scale: "G, A, B, C, D, E, F",
        note1Length: 10,
        note2Length: 3.5,
        patternLength: 4,
        patternAmount: 8,
        octaveLower: 2,
        octaveUpper: 7,
        uniqueTrackPerPattern: false
    },
    {
        name: "9 C 14.5",
        description: "By Duncan Lockerby",
        timeSigBeatAmount: 4,
        timeSigBeatUnit  : 4,
        tempo: 220,
        scale: "C, D, E, F, G, A, B",
        note1Length: 9,
        note2Length: 14.5,
        patternLength: 4,
        patternAmount: 8,
        octaveLower: 2,
        octaveUpper: 7,
        uniqueTrackPerPattern: false
    },
    {
        name: "8 C 14 1/2",
        description: "by Tom Snively",
        timeSigBeatAmount: 4,
        timeSigBeatUnit  : 4,
        tempo: 120,
        scale: "Eb, F, Gb, Ab, Bb, B, Db",
        note1Length: 8,
        note2Length: 14.5,
        patternLength: 3.75,
        patternAmount: 8,
        octaveLower: 2,
        octaveUpper: 7,
        uniqueTrackPerPattern: false
    },
];
