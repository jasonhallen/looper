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
  this.volume_slider = createSlider(0, 1.5, 0.5, 0.01);
  this.volume_slider.size(100, 18);
  this.volume_slider.position(this.track.x_position + 50, this.track.y_position + 102);
  this.volume_input = createInput('',"number");
  this.volume_input.size(45,18);
  this.volume_input.style('font-size:20px;');
  this.volume_input.position(this.track.x_position + 165, this.track.y_position + 106);
  
  this.speed_slider = createSlider(-1, 2, 1, 0.01);
  this.speed_slider.size(100, 18);
  this.speed_slider.position(this.track.x_position + 50, this.track.y_position + 140);
  this.speed_input = createInput('');
  this.speed_input.size(53,18);
  this.speed_input.style('font-size:20px;');
  this.speed_input.position(this.track.x_position + 165, this.track.y_position + 144);
  this.pitch_slider = createSlider(0.5, 1.5, 1, 0.01);
  this.pitch_slider.size(100, 18);
  this.pitch_slider.position(this.track.x_position + 50, this.track.y_position + 178);
  this.pitch_input = createInput('');
  this.pitch_input.size(45,18);
  this.pitch_input.style('font-size:20px;');
  this.pitch_input.position(this.track.x_position + 165, this.track.y_position + 182);
  this.title = createInput(this.track.sample.name);
  this.title.style('font-size:24px;');
  this.title.size(200,30);
  this.title.position(this.track.x_position + 0, this.track.y_position);

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
  this.left_boundary = new LoopBoundary(this.x_position - this.boundary_width, this.y_position, this.boundary_width, this.boundary_height)
  this.right_boundary = new LoopBoundary(this.x_position + this.width, this.y_position, this.boundary_width, this.boundary_height);
  this.loop_start = 0;
  this.loop_end = this.width;
  this.playhead = 0;
  // this.playhead_raw = 0;
  this.playhead_width = 8;
  this.playhead_height = this.boundary_height * 0.9;
  this.playhead_y_position = this.y_position + (this.height - this.playhead_height) / 2;
  this.clip_locked = false;
  this.clicked_mouse_x = 0;
  this.clicked_left_x = 0;
  this.clicked_right_x = 0;

  this.display = function() {
    // Draw waveform
    for (var i = 0; i < this.track.sample.peaks.length; i++) {
      var x = map(i, 0, this.track.sample.peaks.length, this.x_position, this.x_position + this.width);
      // var y = height / 4;
      // var w = 1;
      var h = map(this.track.sample.peaks[i], 1, -1, this.y_position, this.y_position + this.height);

      line(x, this.wave_midpoint, x, h);
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
      // var mouse_constrain = constrain(this.clicked_mouse_x - mouseX, this.clicked_left_x - this.x_position, this.x_position + this.width - this.clicked_right_x)
      this.left_boundary.x_position = this.clicked_left_x - (this.clicked_mouse_x - mouseX);
      this.right_boundary.x_position = this.clicked_right_x - (this.clicked_mouse_x - mouseX);

      if (this.left_boundary.x_position < this.x_position - this.boundary_width) {
        this.left_boundary.x_position = this.x_position - this.boundary_width;
        this.right_boundary.x_position = this.left_boundary.x_position + (this.clicked_right_x - this.clicked_left_x)
      } else if (this.right_boundary.x_position > this.x_position + this.width) {
        this.right_boundary.x_position = this.x_position + this.width;
        this.left_boundary.x_position = this.right_boundary.x_position - (this.clicked_right_x - this.clicked_left_x);
      }
    }

    if (this.left_boundary.locked) {
      this.left_boundary.x_position = mouseX - this.boundary_width/2;
      if (this.left_boundary.x_position < this.x_position) {
        this.left_boundary.x_position = this.x_position - this.boundary_width;
      } else if (this.left_boundary.x_position + this.boundary_width > this.right_boundary.x_position - 5) {
        this.left_boundary.x_position = this.right_boundary.x_position - this.boundary_width - 5;
      // } else {
      //   this.left_boundary.x_position = mouseX - this.boundary_width/2;
      }
    } else if (this.right_boundary.locked) {
      this.right_boundary.x_position = mouseX - this.boundary_width/2;
      if (this.right_boundary.x_position < this.left_boundary.x_position + this.boundary_width + 5) {
        this.right_boundary.x_position = this.left_boundary.x_position + this.boundary_width + 5;
      } else if (this.right_boundary.x_position > this.x_position + this.width) {
        this.right_boundary.x_position = this.x_position + this.width;
      // } else {
      //   this.right_boundary.x_position = mouseX - this.boundary_width/2;
      }
    }
  }
  
  this.released = function() {
    this.clip_locked = false;
    this.left_boundary.released();
    this.right_boundary.released();
    this.loop_start = map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    this.loop_end = map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    csound.setControlChannel("loop_start", this.loop_start);
    csound.setControlChannel("loop_length", this.loop_end - this.loop_start);
    // if (this.track.isPlaying === false) {
    //   this.playhead = this.left_boundary.x_position + (this.boundary_width - this.playhead_width / 2);
    // }
  }
}

function LoopBoundary(x,y,width,height) {
  this.width = width;
  this.height = height; 
  this.x_position = x;
  this.y_position = y;
  this.locked = false;

  this.display = function() {
    if (this.hover() || this.locked) {
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