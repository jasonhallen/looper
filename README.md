# Looper
Inspired by the early work of Carl Stone, the Looper edits, pitch shifts, time stretches, and add effects to WAV samples.  The interface is built with p5.js, HTML, and CSS, and the audio is generated with Web Csound.

## Tasks
* Easy
    * Preload play button image
    * Change all DOM element `chnsets` to `onclick`
    * Pre-process waveform images for each sample
    * Show loading GIF until Csound is ready to perform
* Moderate
    * Create DOM element constructors
    * Improve delay effect
* Hard
    * Audio buffer track that records current output and loops
    * Audio interface input (https://csound.com/docs/manual/inch.html)
    * Port to faster JS solution because p5.js is too slow

## Components