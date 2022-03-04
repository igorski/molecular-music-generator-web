import { CompositionSource } from "../interfaces/CompositionSource";

export const getCompositionName = ( data: CompositionSource ): string => {
    const notes = data.scale.split( "," ).map( note => note.trim() );
    return data.name || `${data.note1Length}${notes[ 0 ]}${data.note2Length}`;
};
