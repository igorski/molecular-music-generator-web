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
import { COMPOSITIONS } from "../../definitions/samples";
import "./CompositionsList.scss";

export default function CompositionsList({ selected, onSelect }) {
    return (
        <div className="compositions-list">
            <h2 className="compositions-list__title">Sample compositions</h2>
            <ul className="compositions-list__container">
            {
                COMPOSITIONS.map( composition =>
                    <li
                        className={ `compositions-list__entry ${selected === composition.name ? "compositions-list__entry--active" : "" }` }
                        onClick={ () => onSelect( composition ) }
                        key={ composition.name }
                    >
                        <h3 className="compositions-list__entry-title">{ composition.name }</h3>
                        <p className="compositions-list__entry-description">{ composition.description }</p>
                    </li>
                )
            }
            </ul>
        </div>
    );
}
