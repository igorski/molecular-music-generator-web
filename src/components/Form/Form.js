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
import { getCompositionName } from "../../utils/StringUtil";
import "./Form.scss";

export default function Form({ formData, onChange }) {

    const data = { ...formData };

    const asFloat = value => {
        const valueAsFloat = parseFloat( value );
        return isNaN( valueAsFloat ) ? "" : valueAsFloat;
    };

    const handleChange = ( prop, value ) => {
        data[ prop ] = value;
        onChange( data );
    };

    return (
        <form className="form" onSubmit={ e => e.nativeEvent.preventDefault() }>
            <div className="form__header">
                <h2 className="form__header-title">{ getCompositionName( data ) }</h2>
            </div>
            <div className="form__container">
                <section className="form__section">
                    <fieldset className="form__fieldset">
                        <legend>Time signature and tempo</legend>
                        <div className="form__wrapper">
                            <label>Time signature</label>
                            <input
                                type="number"
                                min="1"
                                max="64"
                                className="form__time-signature-input"
                                value={ data.timeSigBeatAmount }
                                onChange={ e => handleChange( "timeSigBeatAmount", asFloat( e.target.value )) }
                            />
                            <span className="form__time-signature-divider">/</span>
                            <input
                                type="number"
                                min="1"
                                max="64"
                                value={ data.timeSigBeatUnit }
                                className="form__time-signature-input"
                                onChange={ e => handleChange( "timeSigBeatUnit", asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper form__wrapper--padded-top">
                            <label>Tempo</label>
                            <input
                                type="range"
                                value={ data.tempo }
                                min="40"
                                max="300"
                                onChange={ e => handleChange( "tempo", asFloat( e.target.value )) }
                            />
                        </div>
                    </fieldset>
                    <fieldset className="form__fieldset">
                        <legend>Scale</legend>
                        <div className="form__wrapper">
                            <input
                                type="text"
                                className="full"
                                value={ data.scale }
                                onChange={ e => handleChange( "scale", e.target.value ) }
                            />
                        </div>
                        <p class="form__expl">Enter your scale notes, separating them using commas.</p>
                    </fieldset>
                    <fieldset className="form__fieldset">
                        <legend>MIDI export options</legend>
                        <div className="form__wrapper">
                            <label htmlFor="utpp">Pattern to unique track</label>
                            <input
                                id="utpp"
                                type="checkbox"
                                checked={ data.uniqueTrackPerPattern }
                                onChange={ () => handleChange( "uniqueTrackPerPattern", !data.uniqueTrackPerPattern ) }
                            />
                        </div>
                    </fieldset>
                </section>
                <section className="form__section">
                    <fieldset className="form__fieldset">
                        <legend>Pattern properties</legend>
                        <div className="form__wrapper">
                            <label>First note length</label>
                            <input
                                type="number"
                                min="0"
                                max="16"
                                step="0.01"
                                value={ data.note1Length }
                                onChange={ e => handleChange( "note1Length", asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Second note length</label>
                            <input
                                type="number"
                                min="0"
                                max="16"
                                step="0.01"
                                value={ data.note2Length }
                                onChange={ e => handleChange( "note2Length", asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Pattern length</label>
                            <input
                                type="number"
                                min="1"
                                max="999"
                                value={ data.patternLength }
                                onChange={ e => handleChange( "patternLength", asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Pattern amount</label>
                            <input
                                type="number"
                                min="1"
                                max="999"
                                value={ data.patternAmount }
                                onChange={ e => handleChange( "patternAmount", asFloat( e.target.value )) }
                            />
                        </div>
                    </fieldset>
                    <fieldset className="form__fieldset">
                        <legend>Octave range</legend>
                        <div className="form__wrapper">
                            <label>Lower octave</label>
                            <input
                                type="number"
                                min="1"
                                max={ data.octaveUpper - 1 }
                                value={ data.octaveLower }
                                onChange={ e => handleChange( "octaveLower", asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Higher octave</label>
                            <input
                                type="number"
                                min={ data.octaveLower + 1 }
                                max="8"
                                value={ data.octaveUpper }
                                onChange={ e => handleChange( "octaveUpper", asFloat( e.target.value )) }
                            />
                        </div>
                    </fieldset>
                </section>
            </div>
        </form>
    );
}
