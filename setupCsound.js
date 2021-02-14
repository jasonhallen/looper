var csoundLoaded = false;
let csound;
const samples_list = ["bohannon.wav"];
let sample_list = [];

async function loadResources(csound, filesArray) {
  for (let i = 0; i < filesArray.length; i++) {
    const fileUrl = filesArray[i]; //"myFile.WAV"
    const serverUrl = filesArray[i]; //`${process.env.PUBLIC_URL}/${fileUrl}`;
    //   console.log(serverUrl);
    const f = await fetch(serverUrl);
    const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    // const path = `/${dirToSave}/${fName}`;
    const path = `${fName}`;
    const buffer = await f.arrayBuffer();
    // console.log(path, buffer);
    await csound.writeToFS(path, buffer);
    await generate_peaks(path,buffer);
  }
  return true;
}

function generate_peaks(path, buffer) {
  console.log(buffer.byteLength);
  console.log("TEST");
  csound.audioContext.decodeAudioData(buffer, function (buf) {
    // calculate peaks in buffer, save peak arrays
    console.log(buf.length);
    var peak_array = new Float32Array(500);
    var peaks = 500;
    var sampleSize = buf.length / peaks;
    var sampleStep = ~~(sampleSize / 10) || 1;
    var channels = buf.numberOfChannels;
    for (var c = 0; c < channels; c++) {
      var chan = buf.getChannelData(c);
      for (var i = 0; i < peaks; i++) {
        var start = ~~(i * sampleSize);
        var end = ~~(start + sampleSize);
        var max = 0;
        for (var j = start; j < end; j += sampleStep) {
          var value = chan[j];
          if (Math.abs(value) > Math.abs(max)) {
            max = value;
          } //else if (-value > max) {
          //   max = value;
          // }
        }
        if (c === 0 || Math.abs(max) > peak_array[i]) {
          peak_array[i] = max;
        }
      }
    }
    sample_list.push(new Sample(path,peak_array,buf.length));
  })

}

async function startCsound() {
  csound = new CsoundObj();
  //use this code to load a .csd file and have Csound compile and start it
  fetch('looper.csd').then((response) => {
    response.arrayBuffer().then(async (buf) => {
      csound.writeToFS('looper.csd', buf);
      await loadResources(csound, samples_list);
      // CopyUrlToLocal("myFile.WAV", "HC75.WAV");
      csound.compileCSD('looper.csd');
      csound.start();
      csound.readScore("f0 z");
      csoundLoaded = true;
    })
  })
}

function Sample(file_name, peaks, length) {
  this.name = file_name;
  this.length = length;
  this.peaks = peaks;
}

CsoundObj.initialize().then(() => {
  startCsound();
});