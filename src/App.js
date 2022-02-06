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
import { getCompositionName } from "./utils/StringUtil";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import "./styles/_mixins.scss";

function App() {

    const [ data, setData ] = useState( DEFAULT_COMPOSITION );
    const [ hasChanges, setHasChanges ] = useState( true );
    const [ composition, setComposition ] = useState( null );
    const [ midi, setMidi ] = useState( null );

    // directly generate composition once data has been submitted (or on request)

    const generateComposition = optComposition => {
        try {
            setComposition( createComposition( optComposition || data ));
            setHasChanges( false );
        } catch ( error ) {
            toast( `Error "${error}" occurred during generation of composition. Please verify input parameters and try again.` );
        }
    };

    // directly generate MIDI once composition has been created

    useEffect( () => {
        async function generateMIDI() {
            try {
                if ( composition ) {
                    composition && setMidi( await createMIDI( composition ));
                }
            } catch ( error ) {
                toast( `Error "${error}" occurred during generation of MIDI file. Please verify input parameters and try again.` );
            }
        }
        generateMIDI();
    }, [ composition ]);


    const handleChange = data => {
        setData( data );
        setHasChanges( true );
    };

    const handleCompositionSelect = song => {
        setData( song );
        setHasChanges( false );
        generateComposition( song );
    };

    const downloadMIDI = () => {
        const fileName = `composition_${getCompositionName( data )}.mid`;
        saveAsFile( midi, fileName );
        toast( `MIDI file "${fileName}" generated successfully.` );
    };

    return (
        <div className="app">
            <header className="app__header">
                <div className="app__title">
                    <img src="./logo512.png" className="app__title-logo" alt="Molecular Music Generator logo" />
                    <h1 className="app__title-text">Molecular Music Generator</h1>
                </div>
                <div className="app__actions">
                    <div className="app__actions-container">
                        <div className="app__actions-descr">Generate/select a composition and press play / the spacebar to toggle playback</div>
                        <div className="app__actions-ui">
                            <button
                                type="submit"
                                className="app__actions-button"
                                disabled={ !hasChanges }
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
                </div>
            </header>
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
            <div className="app__footer">
                <p>
                    This is an <a href="https://github.com/igorski/molecular-music-generator-web" title="Molecular Music Generator source code on GitHub" target="_blank" rel="noopener noreferrer">open source</a> tool by igorski.nl. Transport icons designed by&nbsp;
                    <a href="https://freeicons.io/profile/2257" alt="www.wishforge.games profile on Free Icons site" target="_blank" rel="noopener noreferrer">www.wishforge.games</a>&nbsp;
                    on <a href="https://freeicons.io" alt="Free Icons site" target="_blank" rel="noopener noreferrer">freeicons.io</a>.
                </p>
            </div>
            <ToastContainer hideProgressBar autoClose={2500} />
        </div>
    );
}
export default App;
