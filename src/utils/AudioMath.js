export const getMeasureDurationInSeconds = ( bpm, beatsPerMeasure = 4 ) => beatsPerMeasure / ( bpm / 60 );
