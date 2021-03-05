var csoundLoaded = false;
let csound;
const samples_list = [{ file_name: "bohannon.wav", cs_function: 1 },
{ file_name: "my1.wav", cs_function: 2 },
{ file_name: "akiko1.wav", cs_function: 3 },
{ file_name: "z_chamberlin2.wav", cs_function: 4 },
{ file_name: "z_chamberlin6.wav", cs_function: 5 },
{ file_name: "z_chamberlin7.wav", cs_function: 6 },
{ file_name: "z_chamberlin11.wav", cs_function: 7 },
{ file_name: "z_chamberlin17.wav", cs_function: 8 },
{ file_name: "z_chamberlin20.wav", cs_function: 9 },
{ file_name: "z_chamberlin21.wav", cs_function: 10 },
{ file_name: "z_chamberlin22.wav", cs_function: 11 },
{ file_name: "z_chamberlin24.wav", cs_function: 12 },
{ file_name: "z_maestro5.wav", cs_function: 13 },
{ file_name: "z_mridanga2.wav", cs_function: 14 },
{ file_name: "z_multivox16.wav", cs_function: 15 },
{ file_name: "z_nomad5.wav", cs_function: 16 },
{ file_name: "z_univox1.wav", cs_function: 17 },
{ file_name: "z_univox2.wav", cs_function: 18 },
{ file_name: "z_univox6.wav", cs_function: 19 },
{ file_name: "z_univox16.wav", cs_function: 20 },
{ file_name: "z_wurlitzer6.wav", cs_function: 21 },
{ file_name: "z_wurlitzer7.wav", cs_function: 22 },
{ file_name: "akiko2.wav", cs_function: 23 },
{ file_name: "akiko3.wav", cs_function: 24 },
{ file_name: "pv_kyrie.wav", cs_function: 25 },
{ file_name: "pv_hosianna1.wav", cs_function: 26 },
{ file_name: "pv_hosianna2.wav", cs_function: 27 },
{ file_name: "pv_maria.wav", cs_function: 28 },
{ file_name: "pv_es.wav", cs_function: 29 },
{ file_name: "toto.wav", cs_function: 30 },
{ file_name: "c_hallel.wav", cs_function: 31 },
{ file_name: "c_luna.wav", cs_function: 32 },
{ file_name: "pv_cobra.wav", cs_function: 33 },
{ file_name: "baby.wav", cs_function: 34 },
{ file_name: "my2.wav", cs_function: 35 },
{ file_name: "my3.wav", cs_function: 36 },
{ file_name: "bsoidia1.wav", cs_function: 37 },
{ file_name: "bsoidia2.wav", cs_function: 38 },
{ file_name: "dciw1.wav", cs_function: 39 },
{ file_name: "dciw2.wav", cs_function: 40 },
{ file_name: "dciw3.wav", cs_function: 41 },
{ file_name: "dciw4.wav", cs_function: 42 },
{ file_name: "dciw5.wav", cs_function: 43 }];
let sample_list = [];

async function loadResources(csound, filesArray) {
  for (let i = 0; i < filesArray.length; i++) {
    const fileUrl = "samples/" + filesArray[i].file_name; //"myFile.WAV"
    const serverUrl = "samples/" + filesArray[i].file_name; //`${process.env.PUBLIC_URL}/${fileUrl}`;
    //   console.log(serverUrl);
    const f = await fetch(serverUrl);
    const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    // const path = `/${dirToSave}/${fName}`;
    const path = `${fName}`;
    const buffer = await f.arrayBuffer();
    // console.log(path, buffer);
    await csound.writeToFS(path, buffer);
    await generate_peaks2(filesArray[i], buffer);
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
    sample_list.push(new Sample(path.file_name,path.cs_function,peak_array,buf.length));
  })
}

function generate_peaks2(path, buffer) {
  csound.audioContext.decodeAudioData(buffer, function (buf) {
    // calculate peaks in buffer, save peak arrays
    var peak_array = new Float32Array(1000);
    var peaks = 500;
    var sampleSize = buf.length / peaks;
    var sampleStep = ~~(sampleSize / 10) || 1;
    var channels = buf.numberOfChannels;
    for (var c = 0; c < channels; c++) {
      var chan = buf.getChannelData(c);
      for (var i = 0; i < peaks; i++) {
        var start = ~~(i * sampleSize);
        var end = ~~(start + sampleSize);
        var min = 1.0;
        var max = -1.0;
        for (var j = start; j < end; j += sampleStep) {
          var value = chan[j];
          if (value < min) {
            min = value;
          }
          if (value > max) {
            max = value;
          }
        }
        if (c === 0 || Math.abs(max) > peak_array[i]) {
          peak_array[i*2] = max;
          peak_array[i*2+1] = min;
        }
      }
    }
    sample_list.push(new Sample(path.file_name, path.cs_function , peak_array, buf.length));
  })
}

function generateInstrument() {

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

function Sample(file_name, cs_function, peaks, length) {
  this.name = file_name;
  this.cs_function = cs_function;
  this.length = length;
  this.peaks = peaks;
}

CsoundObj.initialize().then(() => {
  startCsound();
});