# Looper
Inspired by the early work of Carl Stone, the Looper edits, pitch shifts, time stretches, and adds effects to WAV samples.  The interface is built with p5.js, HTML, and CSS, and the audio is generated with Web Csound.

## Tasks
* Easy
    * Use `directory` to auto-load WAV files
    * Preload play button image
    * Mixer volume control with arrow keys
* Moderate
    * Why is time lock different across tracks?
    * Improve delay effect
    * Record button send to `fout`
    * Track volume control with keyboard
    * Iron out drum loop timing
    * Fix mixer position on right
    * Fade in duration
    * Tremolo
    * Decimator/bit crusher
* Hard
    * Audio buffer track that records current output and loops
    * Audio interface input (https://csound.com/docs/manual/inch.html)
    * Convert all DOM elements to canvas objects
    * Port to faster JS solution because p5.js is too slow
    * Use csound.node to work with native Csound instead of Web Csound
    * Presets

## Components
* **setupCsound.js** - 
* **sketch.js** - 
* **styles.css** - 
* **index.html** - 
* **looper.csd** - 