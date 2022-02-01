import { useState } from "react";

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
            <fieldset legend="timeSignature">
                <div className="wrapper">
                    <input
                        type="number"
                        min="1"
                        max="64"
                        value={ timeSigBeatAmount }
                        onChange={ e => setTimeSigBeatAmount( asFloat( e.target.value )) }
                    />
                </div>
                <span>/</span>
                <div className="wrapper">
                    <input
                        type="number"
                        min="1"
                        max="64"
                        value={ timeSigBeatUnit }
                        onChange={ e => setTimeSigBeatUnit( asFloat( e.target.value )) }
                    />
                </div>
            </fieldset>
            <div className="wrapper">
                <label>Tempo</label>
                <input
                    type="range"
                    value={ tempo }
                    min="40"
                    max="300"
                    onChange={ e => setTempo( asFloat( e.target.value )) }
                />
            </div>
            <div className="wrapper">
                <label>Scale</label>
                <input
                    type="text"
                    value={ scale }
                    onChange={ e => setScale( e.target.value ) }
                />
            </div>
            <fieldset legend="patternProperties">
                <div className="wrapper">
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
                <div className="wrapper">
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
                <div className="wrapper">
                    <label>Pattern length</label>
                    <input
                        type="number"
                        min="1"
                        max="999"
                        value={ patternLength }
                        onChange={ e => setPatternLength( asFloat( e.target.value )) }
                    />
                </div>
                <div className="wrapper">
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
            <fieldset legend="octaveRange">
                <div className="wrapper">
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
                <div className="wrapper">
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
            <div className="wrapper">
                <legend>Pattern to unique track</legend>
                <input
                    type="checkbox"
                    checked={ uniqueTrackPerPattern }
                    onChange={ () => setUniqueTrackPerPattern( !uniqueTrackPerPattern ) }
                />
            </div>
            <button type="submit">Generate</button>
        </form>
    );
}
