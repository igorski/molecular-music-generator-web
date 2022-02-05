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
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import CompositionsList from "./components/CompositionsList/CompositionsList";
import Form from "./components/Form/Form";
import Info from "./components/Info/Info";
import Player from "./components/Player/Player";
import { DEFAULT_COMPOSITION } from "./definitions/samples";
import { createComposition } from "./services/CompositionService";
import { createMIDI } from "./services/MidiService";
import { saveAsFile } from "./services/FileService";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import "./styles/_mixins.scss";

function App() {

    const [ data, setData ] = useState( DEFAULT_COMPOSITION );
    const [ composition, setComposition ] = useState( null );
    const [ midi, setMidi ] = useState( null );

    // directly generate composition once data has been submitted (or on request)

    const generateComposition = optComposition => {
        try {
            setComposition( createComposition( optComposition || data ));
        } catch ( error ) {
            toast( `Error "${error}" occurred during generation of composition. Please verify input parameters and try again.` );
        }
    };

    // directly generate MIDI once composition has been created

    useEffect(() => {
        try {
            if ( composition ) {
                composition && setMidi( createMIDI( composition ));
            }
        } catch ( error ) {
            toast( `Error "${error}" occurred during generation of MIDI file. Please verify input parameters and try again.` );

        }
    }, [ composition ]);


    const handleChange = data => {
        setData( data );
    };

    const handleCompositionSelect = song => {
        setData( song );
        generateComposition( song );
    };

    const downloadMIDI = () => {
        const notes = data.scale.split( "," ).map( note => note.trim() );
        const fileName = `composition_${data.note1Length}${notes[ 0 ]}${data.note2Length}.mid`;
        saveAsFile( midi, fileName );
        toast( `MIDI file "${fileName}" generated successfully.` );
    };

    return (
        <div className="app">
            <h1 className="app__title">Molecular Music Generator</h1>
            <div className="app__wrapper">
                <div className="app__container">
                    <CompositionsList
                        selected={ data && data.name }
                        onSelect={ handleCompositionSelect }
                    />
                    <Form formData={ data } onChange={ handleChange } />
                    <Info />
                </div>
            </div>
            <div className="app__actions">
                <div className="app__actions-container">
                    <button
                        type="submit"
                        className="app__actions-button"
                        onClick={ () => generateComposition() }
                    >Generate</button>
                    <button
                        type="button"
                        className="app__actions-button"
                        disabled={ midi === null }
                        onClick={ downloadMIDI }
                    >Export MIDI</button>
                    <Player composition={ composition } />
                </div>
            </div>
            <ToastContainer hideProgressBar autoClose={2500} />
        </div>
    );
}
export default App;
