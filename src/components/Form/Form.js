import { useState } from "react";
import "./Form.scss";

export default function Form( props ) {

    const [ timeSigBeatAmount, setTimeSigBeatAmount ] = useState( 4 );
    const [ timeSigBeatUnit,   setTimeSigBeatUnit ]   = useState( 4 );
    const [ tempo, setTempo ] = useState( 120 );
    const [ scale, setScale ] = useState( "C, D, D#, F, G, G#, A#" ); // C minor
    const [ note1Length, setNote1Length ] = useState( 2 );
    const [ note2Length, setNote2Length ] = useState( 0.5 );
    const [ patternLength, setPatternLength ] = useState( 4 );
    const [ patternAmount, setPatternAmount ] = useState( 8 );
    const [ octaveLower, setOctaveLower ] = useState( 2 );
    const [ octaveUpper, setOctaveUpper ] = useState( 7 );
    const [ uniqueTrackPerPattern, setUniqueTrackPerPattern ] = useState( false );

    const asFloat = value => {
        const valueAsFloat = parseFloat ( value );
        return isNaN( valueAsFloat ) ? "" : valueAsFloat;
    };

    const submitForm = e => {
        e.nativeEvent.preventDefault();
        props.onChange({
            timeSigBeatAmount, timeSigBeatUnit, tempo, scale,
            note1Length, note2Length, patternLength, patternAmount,
            octaveLower, octaveUpper, uniqueTrackPerPattern
        });
    };

    return (
        <form className="form" onSubmit={ submitForm }>
            <div className="form__container">
                <section className="form__section">
                    <fieldset className="form__fieldset">
                        <legend>Time signature and tempo</legend>
                        <div className="form__wrapper form__wrapper--full">
                            <input
                                type="number"
                                min="1"
                                max="64"
                                value={ timeSigBeatAmount }
                                onChange={ e => setTimeSigBeatAmount( asFloat( e.target.value )) }
                            />
                            <span>/</span>
                            <input
                                type="number"
                                min="1"
                                max="64"
                                value={ timeSigBeatUnit }
                                onChange={ e => setTimeSigBeatUnit( asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Tempo</label>
                            <input
                                type="range"
                                value={ tempo }
                                min="40"
                                max="300"
                                onChange={ e => setTempo( asFloat( e.target.value )) }
                            />
                        </div>
                    </fieldset>
                    <fieldset className="form__fieldset">
                        <legend>Scale</legend>
                        <div className="form__wrapper">
                            <input
                                type="text"
                                value={ scale }
                                onChange={ e => setScale( e.target.value ) }
                            />
                        </div>
                    </fieldset>
                    <div className="form__wrapper">
                        <label htmlFor="utpp">Pattern to unique track</label>
                        <input
                            id="utpp"
                            type="checkbox"
                            checked={ uniqueTrackPerPattern }
                            onChange={ () => setUniqueTrackPerPattern( !uniqueTrackPerPattern ) }
                        />
                    </div>
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
                                step="0.1"
                                value={ note1Length }
                                onChange={ e => setNote1Length( asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Second note length</label>
                            <input
                                type="number"
                                min="0"
                                max="16"
                                step="0.1"
                                value={ note2Length }
                                onChange={ e => setNote2Length( asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Pattern length</label>
                            <input
                                type="number"
                                min="1"
                                max="999"
                                value={ patternLength }
                                onChange={ e => setPatternLength( asFloat( e.target.value )) }
                            />
                        </div>
                        <div className="form__wrapper">
                            <label>Pattern amount</label>
                            <input
                                type="number"
                                min="1"
                                max="999"
                                value={ patternAmount }
                                onChange={ e => setPatternAmount( asFloat( e.target.value )) }
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
                                max={ octaveUpper - 1 }
                                value={ octaveLower }
                                onChange={ e => setOctaveLower( asFloat( e.target.value )) }
                            />
                        </div>
                        <span>/</span>
                        <div className="form__wrapper">
                            <label>Higher octave</label>
                            <input
                                type="number"
                                min={ octaveLower + 1 }
                                max="8"
                                value={ octaveUpper }
                                onChange={ e => setOctaveUpper( asFloat( e.target.value )) }
                            />
                        </div>
                    </fieldset>
                </section>
            </div>
            <button
                type="submit"
                className="button"
            >Generate</button>
        </form>
    );
}
