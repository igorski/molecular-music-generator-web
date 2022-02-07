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
import { useState } from "react";
import "./Info.scss";

export default function Info( props ) {
    const [ opened, setOpened ] = useState( false );

    return (
        <div className={ `info ${opened ? "info--opened" : "" }` }>
            <div className="info__content">
                <h2 className="info__title">What's this?</h2>
                <div className="info__container">
                    <p>
                        The Molecular Music Generator (MMG) uses a simple algorithm to generate
                        musical patterns which can be fed to hardware or software instruments.
                    </p>
                    <p>
                        The algorithm is based on <a href="https://www.youtube.com/watch?v=3Z8CuAC_-bg" target="_blank" rel="noreferrer">"the Molecular Music Box" by Duncan Lockerby</a>.
                    </p>
                    <p>
                        The rules for the algorithm are as follows:
                    </p>
                    <ul>
                        <li>Two different note lengths need to be defined, e.g. "4" and "3" (in quarter notes)</li>
                        <li>a scale needs to be defined, e.g. C major (the white keys on a piano), let's say we start on the E note, the list of notes will then contain : E, F, G, A, B, C
        a pattern length needs to be defined, e.g. 4 bars</li>
                        <li>The algorithm will then function like so (keeping the above definitions in mind):</li>
                        <li>The first note of the scale (E) is played at the length of the first defined note length (4)</li>
                        <li>Each time the duration of the played note has ended, the next note in the scale (F) is played</li>
                        <li>Once the first pattern length has been reached (4 bars), a new pattern will start</li>
                        <li>The previously "recorded" pattern will loop its contents indefinitely while the new patterns are created / played</li>
                        <li>When a newly played note sounds simultaneously with another note from a PREVIOUS pattern, the note length will change (in above example from 4 to 3)</li>
                        <li>This will be the new note length to use for all subsequent added notes, until another simultaneously played note is found, leading it to switch back to the previous note length (in above example, back to 4)</li>
                        <li>As the pattern is now played over an existing one, it is likely that notes will be played in unison, leading to the switching of note length</li>
                        <li>As more patterns accumulate, a perfectly mathematical pattern of notes are weaving in and out of the notes of the other patterns</li>
                    </ul>
                    <p>
                        Experimenting with different note lengths, scales or even time signatures can lead to interesting results!
                    </p>
                </div>
            </div>
            <button
                type="button"
                className="info__toggle-button"
                onClick={ () => setOpened( !opened ) }
            >{ opened ? "x" : "?" }</button>
        </div>
    );
}
