export const getCompositionName = data => {
    const notes = data.scale.split( "," ).map( note => note.trim() );
    return `${data.note1Length}${notes[ 0 ]}${data.note2Length}`;
};
