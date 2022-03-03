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
import { ScaledCompositionSource } from "../../interfaces/CompositionSource";
import scales from "../../definitions/scales.json";
import { OCTAVE_SCALE } from "../../utils/PitchUtil";
import { getCompositionName } from "../../utils/StringUtil";
import SelectBox from "../UI/SelectBox";
import "./Form.scss";

type FormProps = {
    formData: ScaledCompositionSource,
    onChange: ( event: any ) => void
};

const Form = ({ formData, onChange }: FormProps ) => {

    const data: ScaledCompositionSource = { ...formData };

    const asFloat = ( value: string ) => {
        const valueAsFloat = parseFloat( value );
        return isNaN( valueAsFloat ) ? "" : valueAsFloat;
    };

    const handleChange = ( prop: keyof ScaledCompositionSource, value: any ) => {
        ( data as any )[ prop ] = value;
        onChange( data );
    };

    /* scale related operations */

    const notes = OCTAVE_SCALE.reduce(( acc, note ) => ({ ...acc, [ note ]: note }), {});

    const handleNoteSelect = ( event: React.ChangeEvent ) => {
        setNotes(( event.target as HTMLFormElement ).value, data.scaleSelect.name );
    };

    const handleScaleSelect = ( event: React.ChangeEvent ) => {
        setNotes( data.scaleSelect.note, ( event.target as HTMLFormElement ).value );
    };

    const setNotes = ( note: string, name: string ) => {
        handleChange( "scaleSelect", { note, name });
        const scaleIntervals = ( scales as any )[ name ];
        if ( !scaleIntervals ) {
            return;
        }
        const scaleStart  = OCTAVE_SCALE.indexOf( data.scaleSelect.note );
        const scaleLength = OCTAVE_SCALE.length;
        handleChange( "scale", scaleIntervals.map(( index: number ) => {
            return OCTAVE_SCALE[( scaleStart + index ) % scaleLength ]
        }).filter( Boolean ).join( "," ));
    };

    const shuffleScale = () => {
        handleChange(
            "scale",
            data.scale.split( "," )
                .filter( Boolean )
                .map( value => ({ value, sort: Math.random() }))
                .sort(( a: { sort: number }, b: { sort: number } ) => a.sort - b.sort)
                .map(({ value }) => value.trim() )
                .join( "," )
        );
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
                            <SelectBox
                                title="Root note"
                                items={ notes }
                                selected={ data.scaleSelect.note }
                                onChange={ handleNoteSelect }
                            />
                            <SelectBox
                                title="Scale"
                                items={ scales }
                                selected={ data.scaleSelect.name }
                                onChange={ handleScaleSelect }
                            />
                        </div>
                        <div className="form__wrapper">
                            <input
                                type="text"
                                className="full"
                                value={ data.scale }
                                onChange={ e => handleChange( "scale", e.target.value ) }
                            />
                            <button
                                type="button"
                                className="form__button"
                                onClick={ shuffleScale }
                            >Shuffle</button>
                        </div>
                        <p className="form__expl">Either select a root note and scale name or directly enter your
                        scale notes in the input field, separating them using commas.</p>
                    </fieldset>
                    <fieldset className="form__fieldset">
                        <legend>MIDI export options</legend>
                        <div className="form__wrapper">
                            <label htmlFor="utpp">Generate unique MIDI track for each new pattern</label>
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
                        <p className="form__expl">Note: all lengths above are defined in <i>beats</i>, relative to the time signatures <i>denominator</i> (lower number).</p>
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
};
export default Form;
