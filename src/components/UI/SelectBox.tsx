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
import styled from "styled-components";

const Select = styled.select`
    width: 100%;
    height: 35px;
    background: white;
    color: gray;
    padding: 0 5px;
    font-size: 14px;
    border: none;
    margin-right: 10px;
    border-radius: 7px;

    option {
        color: black;
        background: white;
        display: flex;
        white-space: pre;
        min-height: 20px;
        padding: 0px 2px 1px;
    }
`;

type SelectBoxProps = {
    title: string,
    items: object,
    onChange: ( event: any ) => void,
    selected?: string
};

/**
 * @param {String} title of select box
 * @param {Object} items key value pairs of all options to display
 * @param {Function} onChange handler to fire when option is selected
 * @param {String=} selected name of the optionally selected option key
 */
export default function SelectBox({ title, items, onChange, selected = "" }: SelectBoxProps ) {

    return (
        <Select onChange={ onChange } value={ selected }>
            <option value="" hidden>{ title }</option>
            {
                Object.entries( items ).map(([ key, value ]) =>
                    <option
                        key={key}
                        value={ key }
                    >{key}</option>
                )
            }
        </Select>
    );
};
