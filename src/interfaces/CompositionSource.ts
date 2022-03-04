/**
 * Describes the input properties to generate
 * a composition.
 *
 * @see Composition.ts and CompositionService.ts
 */
export interface CompositionSource {
    name: string,
    description: string,
    timeSigBeatAmount: number,
    timeSigBeatUnit: number,
    tempo: number,
    scale: string,
    note1Length: number,
    note2Length: number,
    patternLength: number,
    patternAmount: number,
    octaveLower: number,
    octaveUpper: number,
    uniqueTrackPerPattern: boolean
};

/**
 * Extends CompositionSource to include source scale selection
 * allowing easy modification of key or note order
 *
 * @see Form.tsx
 */
export interface ScaledCompositionSource extends CompositionSource {
    scaleSelect: {
        note: string,
        name: string
    }
};
