/**
* Transpose chord base tone by given shift
* @param  chord
* @param  shift
* @returns {string}
*/
export default function transpose(chord, shift) {
    const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'BB', 'H'];

    let isLowerCase = (chord.toLowerCase() === chord); //If chord on input is lowercase, output has to be lowercase too
    if (shift < 0) {
        shift = (chords.length + shift) % chords.length;
    }
    let parts = chord.match(/^(.[#b]?)(.*)$/, chord);
    let base = parts[1]; //For C#maj7 it is "C#"

    let rest = parts[2]; //For C#maj7 it is "maj7"
    let index = chords.indexOf(base.toUpperCase());

    if (index == -1) return chord; // Retrun if chord is not listed

    let newBase = chords[(index + shift) % chords.length]; //shifted base tone

    if (isLowerCase) {
        newBase = newBase.toLowerCase();
    } else if (newBase === 'BB') {
        newBase = 'Bb'; //this is special case, second 'b' has to be lowercase to make sense
    }

    return newBase + rest;
}
