import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Form from "./components/Form/Form";
import { createComposition } from "./services/CompositionService";
import { createMIDI } from "./services/MidiService";
import { saveAsFile } from "./services/FileService";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import "./styles/_mixins.scss";

function App() {
    const [ data, setData ] = useState( null );
    const [ composition, setComposition ] = useState( null );
    const [ midi, setMidi ] = useState( null );

    // directly generate composition once data has been submitted

    useEffect(() => {
        try {
            if ( data ) {
                setComposition( createComposition( data ));
                toast( `Composition generated successfully.` );
            }
        } catch ( error ) {
            toast( `Error "${error}" occurred during generation of composition. Please verify input parameters and try again.` );
        }
    }, [ data ]);

    // directly generate MIDI once composition has been submitted

    useEffect(() => {
        try {
            composition && setMidi( createMIDI( composition ));
        } catch ( error ) {
            toast( `Error "${error}" occurred during generation of MIDI file. Please verify input parameters and try again.` );

        }
    }, [ composition ]);


    const handleChange = data => {
        setData( data );
    };

    const downloadMIDI = () => {
        const fileName = `composition_${Date.now()}.mid`;
        saveAsFile( midi, fileName );
        toast( `MIDI file "${fileName}" generated successfully.` );
    };

    return (
        <div className="app">
            <h1>Molecular Music Generator</h1>
            <Form onChange={ handleChange } />
            <div className="buttons">
                <button
                    type="button"
                    className="button"
                    disabled={ midi === null }
                    onClick={ downloadMIDI }
                >Export MIDI</button>
            </div>
            <ToastContainer hideProgressBar autoClose={2500} />
        </div>
    );
}
export default App;
