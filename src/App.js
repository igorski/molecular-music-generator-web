import { useState, useEffect } from "react";
import Form from "./components/Form/Form";
import { createComposition } from "./services/CompositionService";
import { createMIDI } from "./services/MidiService";
import { saveAsFile } from "./services/FileService";
import "./App.scss";

function App() {
    const [ data, setData ] = useState( null );
    const [ composition, setComposition ] = useState( null );
    const [ midi, setMidi ] = useState( null );

    // directly generate composition once data has been submitted

    useEffect(() => {
        try {
            data && setComposition( createComposition( data ));
        } catch ( error ) {
            // TODO
            console.warn( error );
        }
    }, [ data ]);

    // directly generate MIDI once composition has been submitted

    useEffect(() => {
        try {
            composition && setMidi( createMIDI( composition ));
        } catch ( error ) {
            // TODO
            console.warn( error );
        }
    }, [ composition ]);


    const handleChange = data => {
        setData( data );
    };

    const downloadMIDI = () => {
        saveAsFile( midi, `composition_${Date.now()}.mid` );
    };

    return (
        <div className="app">
            <Form onChange={ handleChange } />
            <button
                type="button"
                disabled={ midi === null }
                onClick={ downloadMIDI }
            >Export MIDI</button>
        </div>
    );
}
export default App;
