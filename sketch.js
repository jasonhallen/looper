let isPlaying = false;
let samples_peaks = [];
let track_list = [];
let lbx, lby, rbx, rby;
let loading_img;

function preload() {
  roboto = loadFont('OverpassMono-Bold.ttf');
  loading_image = loadImage('loading.gif');
  // add_image = loadImage('add.png');
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  background(227, 75, 116);
  loading_image.resize(300, 300);
  textFont(roboto);
  textAlign(LEFT,TOP);
  add_button = createImg("add.png", "Add");
  add_button.mouseClicked(add_track);
  add_button.size(70, 70);
  add_button.position(50,50);
  add_button.hide();
}

function draw() {
  background(227,75,116);
  fill(255);

  if (!sample_list[0]) {
    image(loading_image,450,150);
  } else if (sample_list[0]) {
    if (!track_list[0]) { 
      add_button.show();
      textSize(70);
      text("add track", 150, 36);
    } else {
      add_button.hide();
      track_list.forEach(track => track.display());
    }
  }
}

function add_track() {
  track_list.push(new Track(track_list.length));
}

// function play_pause(track) {
//   if (track.isPlaying === false) {
//     csound.audioContext.resume();
//     track.isPlaying = true;
//     csound.readScore("i 1 0 -1");
//     // play_button.html('PAUSE');
//     track.play_button.attribute('src','pause.png');
//   } else {
//     track.isPlaying = false;
//     csound.readScore("i -1 0 1");
//     // play_button.html('PLAY');
//     track.play_button.attribute('src', 'play.png');
//   }
// }

function mousePressed() {
  track_list.forEach(track => track.wavePanel.clicked());
}

function mouseClicked() {
  track_list.forEach(track => track.controlPanel.clicked());
}

function mouseDragged() {
  track_list.forEach(track => track.wavePanel.dragged());
  track_list.forEach(track => track.controlPanel.dragged());
}

function mouseReleased() {
  track_list.forEach(track => track.wavePanel.released());
}

function keyPressed() {
  if (keyCode === ENTER) {
    track_list.forEach(track => track.controlPanel.update_sliders());
  }
}

function hover(x_position, y_position, width, height) {
  if (
    mouseX > x_position &&
    mouseX < x_position + width &&
    mouseY > y_position &&
    mouseY < y_position + height
  ) {
    return true;
  } else {
    return false;
  }
}

function Track(track_number) {
  this.width = 1200;
  this.height = 200;
  this.x_position = 20;
  this.y_position = 30 + this.height * track_number;
  this.track_number = track_number;
  this.sample = sample_list[track_number];
  this.isPlaying = false;
  this.controlPanel = new ControlPanel(this);
  this.wavePanel = new WavePanel(this);

  this.display = function() {
    this.controlPanel.display();
    this.wavePanel.display();
    if (csound) {
      csound.setControlChannel("volume", this.controlPanel.volume_slider.value());
      csound.setControlChannel("speed", this.controlPanel.speed_slider.value());
      csound.setControlChannel("pitch", this.controlPanel.pitch_slider.value());
    }    
  }
}

function ControlPanel(track) {
  this.track = track;
  this.play_button = createImg('play.png', "Play");
  this.play_button.size(70, 70);
  this.play_button.position(this.track.x_position + 100, this.track.y_position + 30);
  
  this.play_pause = () => {
    if (this.track.isPlaying === false) {
      csound.audioContext.resume();
      this.track.isPlaying = true;
      // console.log(this.isPlaying);
      csound.readScore("i 1 0 -1");
      this.play_button.attribute('src', 'pause.png');
    } else {
      this.track.isPlaying = false;
      // console.log(this.isPlaying);
      csound.readScore("i -1 0 1");
      this.play_button.attribute('src', 'play.png');
      // this.track.wavePanel.playhead = this.track.wavePanel.left_boundary.x_position + (this.track.wavePanel.boundary_width - this.track.wavePanel.playhead_width / 2);
    }
  }
  
  this.play_button.mousePressed(this.play_pause); //function() => {this.play_pause();}); //this.play_pause);
  // play_button.style('font-family:roboto;font-size:24px;background:white;');
  // play_button.style("font-size", "24px");
  this.mute_button = createButton("Mute");
  
  this.volume_slider = createSlider(0, 1.5, 0.5, 0.01);
  this.volume_slider.size(100, 18);
  this.volume_slider.position(this.track.x_position + 50, this.track.y_position + 102);
  this.volume_input = createInput('',"number");
  this.volume_input.size(45,18);
  this.volume_input.style('font-size:20px;');
  this.volume_input.position(this.track.x_position + 165, this.track.y_position + 106);
  this.volume_input.attribute("onclick", "this.select()");
  
  this.speed_slider = createSlider(-1, 2, 1, 0.01);
  this.speed_slider.size(100, 18);
  this.speed_slider.position(this.track.x_position + 50, this.track.y_position + 140);
  this.speed_input = createInput('',"number");
  this.speed_input.size(53,18);
  this.speed_input.style('font-size:20px;');
  this.speed_input.position(this.track.x_position + 165, this.track.y_position + 144);
  this.speed_input.attribute("onclick", "this.select()");
  this.pitch_slider = createSlider(0.5, 1.5, 1, 0.01);
  this.pitch_slider.size(100, 18);
  this.pitch_slider.position(this.track.x_position + 50, this.track.y_position + 178);
  this.pitch_input = createInput('',"number");
  this.pitch_input.size(45,18);
  this.pitch_input.style('font-size:20px;');
  this.pitch_input.position(this.track.x_position + 165, this.track.y_position + 182);
  this.pitch_input.attribute("onclick", "this.select()");
  this.title = createInput(this.track.sample.name);
  this.title.style('font-size:24px;');
  this.title.size(200,30);
  this.title.position(this.track.x_position + 0, this.track.y_position);
  this.reset_button = createButton("Reset Phase");
  this.reset_button.position(200,400);
  this.reset_phase_status = 0;
  this.reset_phase = () => {
    this.reset_phase_status = this.reset_phase_status + 1;
    csound.setControlChannel("reset_phase", this.reset_phase_status);    
  }
  this.reset_button.mousePressed(this.reset_phase);

  this.unison_button = createButton("U");
  this.unison_button.size(20,30);
  this.unison_button.position(225,220);
  this.m2_button = createButton("m2");
  this.M2_button = createButton("M2");
  this.m3_button = createButton("m3");
  this.M3_button = createButton("M3");
  this.p4_button = createButton("4");
  this.tritone_button = createButton("T");
  this.p5_button = createButton("5");
  this.m6_button = createButton("m6");
  this.M6_button = createButton("M6");
  this.m7_button = createButton("m7");
  this.M7_button = createButton("M7");
  this.octave_button = createButton("2U");

  this.display = function() {
    textSize(50);
    text("[" + (this.track.track_number + 1) + "]", this.track.x_position - 9, this.track.y_position + 30);
    textSize(24);
    text("Vlm", this.track.x_position, this.track.y_position + 105);
    // this.volume_input.value(this.volume_slider.value());
    text("Spd", this.track.x_position, this.track.y_position + 143);
    // this.speed_input.value(this.speed_slider.value());
    text("Ptc", this.track.x_position, this.track.y_position + 181);
    // this.pitch_input.value(this.pitch_slider.value());

    // text(this.track.sample.name, this.track.x_position + 0, this.track.y_position);
    stroke(255);
    strokeWeight(2);
  }

  this.clicked = function() {
    this.volume_input.value(~~map(this.volume_slider.value(),0,1.5,0,100));
    this.speed_input.value(this.speed_slider.value());
    this.pitch_input.value(this.pitch_slider.value());
  }

  this.dragged = function() {
    this.volume_input.value(~~map(this.volume_slider.value(), 0, 1.5, 0, 100));
    this.speed_input.value(this.speed_slider.value());
    this.pitch_input.value(this.pitch_slider.value());
  }

  this.update_sliders = function() {
    this.volume_slider.value(map(this.volume_input.value(), 0, 100, 0, 1.5));
    this.speed_slider.value(this.speed_input.value());
    this.pitch_slider.value(this.pitch_input.value());
  }
}

function WavePanel(track) {
  this.track = track;
  this.width = 775;
  this.height = 150;
  this.boundary_width = 14;
  this.boundary_height = this.height;
  this.x_position = this.track.x_position + 235;
  this.y_position = this.track.y_position + 10;
  this.wave_midpoint = this.y_position + (this.height / 2);
  this.left_boundary = new LoopBoundary(this.track, this.x_position - this.boundary_width, this.y_position, this.boundary_width, this.boundary_height)
  this.right_boundary = new LoopBoundary(this.track, this.x_position + this.width, this.y_position, this.boundary_width, this.boundary_height);
  this.loop_start = 0;
  csound.setControlChannel("loop_start", 0);
  this.loop_end = this.track.sample.length;
  this.playhead = 0;
  // this.playhead_raw = 0;
  this.playhead_width = 8;
  this.playhead_height = this.boundary_height * 0.9;
  this.playhead_y_position = this.y_position + (this.height - this.playhead_height) / 2;
  this.clip_locked = false;
  this.clicked_mouse_x = 0;
  this.clicked_left_x = 0;
  this.clicked_right_x = 0;
  csound.setControlChannel("loop_start_continuous", 0);
  this.click_released = 0;
  this.cs_loop_start = 0;
  this.cs_loop_length = 0;
  this.reset_count = 0;
  this.cs_phase = 0;
  this.loop_length_continuous = 0;
  this.loop_start_continuous = 0;
  
  this.display = function() {
    // Draw waveform
    strokeWeight(3);
    for (var i = 0; i < this.track.sample.peaks.length; i = i + 6) {
      var x = map(i, 0, this.track.sample.peaks.length, this.x_position, this.x_position + this.width);
      var max = map(this.track.sample.peaks[i], 1, -1, this.y_position, this.y_position + this.height);
      var min = map(this.track.sample.peaks[i+1], 1, -1, this.y_position, this.y_position + this.height);
      strokeCap(SQUARE);
      line(x, this.wave_midpoint, x, max);
      line(x, this.wave_midpoint, x, min);
    }

    if (hover(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height) || this.clip_locked) {
      noStroke();
      fill('rgba(255,255,255,0.15)');
      rect(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height);
    }

    // Draw left and right boundaries
    this.left_boundary.display();
    this.right_boundary.display();
    
    // Draw playhead
    noStroke();
    fill('rgba(52, 184, 227, 0.9)');
    if (this.track.isPlaying === true) {
      // csound.requestControlChannel("playhead", () => this.playhead_raw = csound.getControlChannel("playhead"));
      // this.playhead = map(this.playhead_raw, 0, this.track.sample.length, this.x_position, this.x_position + this.width);
      csound.requestControlChannel("playhead", () => this.playhead = map(csound.getControlChannel("playhead"), 0, this.track.sample.length, this.x_position, this.x_position + this.width));
      rect(this.playhead - this.playhead_width/2, this.playhead_y_position, this.playhead_width, this.playhead_height);
    } else {
      this.playhead = this.left_boundary.x_position + (this.boundary_width - this.playhead_width/2);
      // this.playhead = this.left_boundary.x_position + (this.boundary_width - this.playhead_width);
      rect(this.playhead, this.playhead_y_position, this.playhead_width, this.playhead_height);
    }
    // stroke('rgba(255,255,255,0.75)');
    // line(this.playhead + this.playhead_width / 2, this.playhead_y_position, this.playhead + this.playhead_width / 2, this.playhead_y_position + this.playhead_height);
    // noStroke();
    fill(255);
    text("p5js Start: "+this.loop_start, 300, 250);
    text("p5js Length: " + (this.loop_end - this.loop_start), 300, 280);
    text("p5js End: " +this.loop_end, 300, 310);
    text("ClickedX: " +this.clicked_left_x, 300, 340);
    csound.requestControlChannel("cs_loop_start", () => this.cs_loop_start = csound.getControlChannel("cs_loop_start"));
    csound.requestControlChannel("cs_loop_length", () => this.cs_loop_length = csound.getControlChannel("cs_loop_length"));
    csound.requestControlChannel("reset_count", () => this.reset_count = csound.getControlChannel("reset_count"));
    csound.requestControlChannel("cs_phase", () => this.cs_phase = csound.getControlChannel("cs_phase"));
    text("Clip locked: " + this.clip_locked, 300, 370);
    text("Loop Length Cont: " + this.loop_length_continuous, 300, 400);
    text("Loop Start Cont: " + this.loop_start_continuous, 300, 430);
    text("Cs Loop Start: " + this.cs_loop_start, 600, 250);
    text("Cs Loop Length: " + this.cs_loop_length, 600, 280);
    text("Cs Phase: " + this.cs_phase, 600, 310);
    text("Cs Reset Count: " + this.reset_count, 600, 340);
    csound.setControlChannel("loop_length_continuous", this.loop_length_continuous);
    csound.setControlChannel("loop_start_continuous", this.loop_start_continuous);


    // this.loop_start = ~~map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // // }
    // this.loop_end = ~~map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // csound.setControlChannel("loop_start", this.loop_start);
    // if (this.clip_locked) {
    //   csound.setControlChannel("loop_length", this.track.sample.length - this.clicked_left_x);
    // } else {
    //   csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
    // }
  }

  this.clicked = function() {
    this.clicked_mouse_x = mouseX;
    this.clicked_left_x = this.left_boundary.x_position;
    this.clicked_right_x = this.right_boundary.x_position;

    if (hover(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height)) {
      this.clip_locked = true;
    }
    this.left_boundary.clicked();
    this.right_boundary.clicked();
  }
  
  this.dragged = function() {
    if (this.clip_locked) {
      this.loop_length_continuous = 1;
      // csound.setControlChannel("loop_length_continuous", this.loop_length_continuous);    
      
      this.left_boundary.x_position = this.clicked_left_x - (this.clicked_mouse_x - mouseX);
      this.right_boundary.x_position = this.clicked_right_x - (this.clicked_mouse_x - mouseX);
      
      if (this.left_boundary.x_position < this.x_position - this.boundary_width) {
        this.left_boundary.x_position = this.x_position - this.boundary_width;
        this.right_boundary.x_position = this.left_boundary.x_position + (this.clicked_right_x - this.clicked_left_x)
      } else if (this.right_boundary.x_position > this.x_position + this.width) {
        this.right_boundary.x_position = this.x_position + this.width;
        this.left_boundary.x_position = this.right_boundary.x_position - (this.clicked_right_x - this.clicked_left_x);
      }
      if (this.track.controlPanel.speed_slider.value() > 0 && this.right_boundary.x_position < this.playhead) {
        //   // this.loop_start = map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
        //   // csound.setControlChannel("loop_start", this.loop_start);
        //   // this.loop_end = map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
        //   // csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
        this.track.controlPanel.reset_phase();
      }
      
    }
    
    if (this.left_boundary.locked) {
      this.left_boundary.x_position = mouseX - this.boundary_width/2;
      if (this.left_boundary.x_position < this.x_position) {
        this.left_boundary.x_position = this.x_position - this.boundary_width;
      } else if (this.left_boundary.x_position + this.boundary_width > this.right_boundary.x_position - 2) {
        this.left_boundary.x_position = this.right_boundary.x_position - this.boundary_width - 2;
      }
    } else if (this.right_boundary.locked) {
      this.loop_length_continuous = 1;
      csound.setControlChannel("loop_length_continuous", this.loop_length_continuous);    
      this.right_boundary.x_position = mouseX - this.boundary_width/2;
      if (this.right_boundary.x_position < this.left_boundary.x_position + this.boundary_width + 2) {
        this.right_boundary.x_position = this.left_boundary.x_position + this.boundary_width + 2;
      } else if (this.right_boundary.x_position > this.x_position + this.width) {
        this.right_boundary.x_position = this.x_position + this.width;
      }
    }
    
    // if (this.clip_locked) {
    //   this.loop_start = map((this.clicked_left_x + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // } else {

      this.loop_start = ~~map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // }
    this.loop_end = ~~map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    csound.setControlChannel("loop_start", this.loop_start);
    if (this.clip_locked) {
      csound.setControlChannel("loop_length", this.track.sample.length - this.clicked_left_x);
    } else {
      csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
    }
  }
  
  this.released = function() {
    if (this.clip_locked) {
      this.loop_start = ~~map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
      this.loop_end = ~~map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
      csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
      // this.loop_length_continuous = 0;
      // csound.setControlChannel("loop_length_continuous", this.loop_length_continuous);
      // csound.setControlChannel("loop_start_continuous", 0);
      this.click_released += 1;
      csound.setControlChannel("click_released", this.click_released)
    }
    // if (this.right_boundary.locked) {
    //   this.loop_length_continuous = 0;
    // }
    this.loop_length_continuous = 0;
    this.clip_locked = false;
    this.left_boundary.released();
    this.right_boundary.released();
    if (this.track.controlPanel.speed_slider.value() > 0 && this.left_boundary.x_position > this.playhead) {
      this.track.controlPanel.reset_phase();
    }
    // csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
      // this.loop_start = map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // this.loop_end = map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    // csound.setControlChannel("loop_start", this.loop_start);
    // csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
    // if (this.track.isPlaying === false) {
    //   this.playhead = this.left_boundary.x_position + (this.boundary_width - this.playhead_width / 2);
    // }
  }
}

function LoopBoundary(track,x,y,width,height) {
  this.track = track;
  this.width = width;
  this.height = height; 
  this.x_position = x;
  this.y_position = y;
  this.locked = false;

  this.display = function() {
    if (this.hover() || this.locked || this.track.wavePanel.clip_locked) {
      stroke('rgba(227,218,98,1)');
      strokeWeight(2);
      fill('rgba(227, 218, 98, 0.5)');
    } else {
      noStroke();
      fill('rgba(227,218,98,0.85)');
    }
    rect(this.x_position, this.y_position, this.width, this.height);
  }

  this.hover = function() {
    if (
      mouseX > this.x_position &&
      mouseX < this.x_position + this.width &&
      mouseY > this.y_position &&
      mouseY < this.y_position + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  this.clicked = function() {
    
    if (this.hover()) {
      this.locked = true;
    } else {
      this.locked = false;
    }
  }

  this.released = function() {
    // this.track.dragged();
    this.locked = false;
  }
}

function CustomSlider(min, max, start, step, track) {
  this.track = track;
  this.slider = createSlider(min, max, start, step);
  this.slider.size(100, 18);
  this.slider.position(this.track.x_position + 50, this.track.y_position + 102);
}