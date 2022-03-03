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
import { CompositionSource } from "../interfaces/CompositionSource";

export const DEFAULT_COMPOSITION: CompositionSource = {
    name: "Default",
    description: "Something to set the mood. Ascending the C minor scale.",
    timeSigBeatAmount: 4,
    timeSigBeatUnit: 4,
    tempo: 120,
    scale: "C,D,D#,F,G,G#,A#",
    note1Length: 2,
    note2Length: 0.5,
    patternLength: 16,
    patternAmount: 8,
    octaveLower: 2,
    octaveUpper: 7,
    uniqueTrackPerPattern: false
};

export const COMPOSITIONS: Array<CompositionSource> = [
    DEFAULT_COMPOSITION,
    {
        ...DEFAULT_COMPOSITION,
        name: "4F1",
        description: "Waltz in the \"saddest of keys\", starting on F.",
        timeSigBeatAmount: 3,
        timeSigBeatUnit: 4,
        tempo: 136,
        scale: "F,G,A,Bb,C,D,E",
        note1Length: 4,
        note2Length: 1,
        patternLength: 6,
        patternAmount: 16,
        octaveLower: 3,
        octaveUpper: 6,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "4E3",
        description: "By Duncan Lockerby, as explained in his video. C major starting on E.",
        scale: "E,F,G,A,B,C,D",
        note1Length: 4,
        note2Length: 3,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "10 G 3.5",
        description: "By Duncan Lockerby. A slow piece in C major, starting on G.",
        scale: "G,A,B,C,D,E,F",
        note1Length: 10,
        note2Length: 3.5,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "9 C 14.5",
        description: "By Duncan Lockerby",
        tempo: 220,
        scale: "C,D,E,F,G,A,B",
        note1Length: 9,
        note2Length: 14.5,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "11.5 B 4",
        description: "By Duncan Lockerby. C major starting on B.",
        tempo: 240,
        scale: "B,C,D,E,F,G,A",
        note1Length: 11.5,
        note2Length: 4,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "0.5 C 3",
        description: "A frenetic piece, using a shuffled list of intervals in C Romanian / Ukranian Dorian",
        timeSigBeatAmount: 4,
        timeSigBeatUnit: 4,
        tempo: 110,
        scale: "A#,F#,D#,G,A,D,C",
        note1Length: 0.5,
        note2Length: 3,
        patternLength: 4,
        patternAmount: 8,
        octaveLower: 2,
        octaveUpper: 7,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "Enigmatic scale",
        description: "The input used by Drosophelia for the song \"6581\", where each pattern was played through a separate Commodore 64.",
        tempo: 96,
        scale: "C,C#,G#,E,F#,B,G#",
        note1Length: 1.5,
        note2Length: 4,
        patternLength: 8,
        patternAmount: 18,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "Sand Prince",
        description: "A brooding piece based around E phrygian dominant in 7/8 time.",
        tempo: 140,
        timeSigBeatAmount: 7,
        timeSigBeatUnit: 8,
        scale: "F,G#,E,A,B,D,C",
        note1Length: 3,
        note2Length: 4,
        patternLength: 14,
        patternAmount: 32,
    },
    {
        ...DEFAULT_COMPOSITION,
        name: "Diminished scale in 5/8",
        description: "The input used by Drosophelia for the industrial piece \"Vexed\", where each pattern was processed by a separate noise synth.",
        timeSigBeatAmount: 5,
        timeSigBeatUnit: 8,
        tempo: 165,
        scale: "E,F,G,G#,A#,B,C#,D",
        note1Length: 6,
        note2Length: 1,
        patternLength: 8,
        patternAmount: 16,
    },
];
