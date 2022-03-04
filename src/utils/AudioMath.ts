export const getMeasureDurationInSeconds = ( bpm:number, beatsPerMeasure:number = 4 ): number => {
    return beatsPerMeasure / ( bpm / 60 );
};
