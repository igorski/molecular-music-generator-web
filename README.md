# Molecular Music Generator (Web)

The Molecular Music Generator (MMG) is an application that uses a simple algorithm to generate musical patterns which can be fed to hardware or software instruments.

The properties of the algorithm can easily be defined in a graphical interface, which will then be rendered into a MIDI file, which can in turn be opened in DAW music software or be played back by synthesizers.

This is the second installment of the application, which previously was available as a downloadable Java application.

### I want to tinker with this with the least effort!

If you just want to make music and aren't interested in modifying the source code, no worries, you can
jump to the hosted version [right here](https://www.igorski.nl/application/molecular-music-generator)

Read the sections below to learn how the algorithm works and how to tailor a composition to your liking.

## About the algorithm

The algorithm is based on "the Molecular Music Box" by Duncan Lockerby.

The rules for the algorithm are as follows :

 * two different note lengths need to be defined, e.g. "4" and "3" (in quarter notes)
 * a scale needs to be defined, e.g. C major (the white keys on a piano), let's say we start on the E note, the list of
   notes will then contain : E, F, G, A, B, C
 * a pattern length needs to be defined, e.g. 4 bars

The algorithm will then function like so (keeping the above definitions in mind) :

 * the first note of the scale (E) is played at the length of the first defined note length (4)
 * each time the duration of the played note has ended, the NEXT note in the scale (F) is played
 * once the first pattern length has been reached (4 bars), a new pattern will start
 * the previously "recorded" pattern will loop its contents indefinitely while the new patterns are created / played
 * if a newly played note sounds simultaneously with another note from a PREVIOUS pattern, the note length will
   change (in above example from 4 to 3).
 * this will be the new note length to use for ALL SUBSEQUENT added notes, until another simultaneously played
   note is found, leading it to switch back to the previous note length (in above example, back to 4).
 * as the pattern is now played over an existing one, it is likely that notes will be played in unison,
   leading to the switching of note length
 * as more patterns are accumulated, a perfectly mathematical pattern of notes are weaving in and out of
   the notes of the other patterns

Experimenting with different note lengths, scales or even time signatures can lead to interesting results!

See https://www.youtube.com/watch?v=3Z8CuAC_-bg for the original video by Duncan Lockerby.

## How to setup the pattern properties in the application

"First / second note lengths" define a list of two notes that describes the alternate note length/duration as a quarter note.

"Pattern length" describes the length of a single pattern (in measures). Once the algorithm has generated notes
for the given amount of measures, a new pattern will be created. This process will repeat itself until the configured "amount of patterns" has been reached. For instance: a configuration with a pattern length of 4 and a pattern amount of 8 will result in 32 measures of music.

You can alter the time signature to any exotic meter of your liking, the first number is the upper numeral in
a time signature, e.g. the "3" in 3/4, while the second number is the lower numeral, e.g. the "4" in 3/4.

"Min octave" determines the octave at which the composition will start, this cannot be lower than 0. "Max octave" determines the octave at which the composition will end, this cannot be higher than 8.

The value for "scale" can be changed to any sequence (or length!) of comma separated notes you like, meaning you can use exotic scales, or even determine the movement by creating a sequence in thirds, or by re-introducing a previously defined note, etc. Remember that the scale will be repeated over the determined octave range. You can create sharps and flats too, e.g.: "_Eb_", "_F#_", etc. are all valid input.

"track per pattern" can be either '_true_' or '_false_'. When true, the resulting .MIDI file will have a unique MIDI track for each new pattern, when false, all the patterns are part of the same MIDI track. If the amount of patterns is high enough for the algorithm to go back down the scale, it is best to have this set to true to avoid conflicts in MIDI notes.

## Build scripts

In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

```
npm test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
