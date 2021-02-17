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
  // track_list.push(new Track(track_list.length));
}

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
  this.height = 400;
  this.x_position = 20;
  this.y_position = 30 + this.height * track_number;
  this.track_number = track_number;
  this.sample = sample_list[track_number];
  this.isPlaying = false;
  this.controlPanel = new ControlPanel(this);
  this.wavePanel = new WavePanel(this);
  this.effectsPanel = new EffectsPanel(this);

  this.display = function() {
    this.controlPanel.display();
    this.wavePanel.display();
    this.effectsPanel.display();
  }
}

function ControlPanel(track) {
  this.track = track;
  this.height = 250;
  this.sample_select = createSelect();
  sample_list.forEach(sample => this.sample_select.option(sample.name));
  this.sample_select.position(this.track.x_position, this.track.y_position - 20);
  this.sample_change = () => {
    this.track.sample = sample_list.find(element => element.name === this.sample_select.value());
  }
  this.sample_select.changed(this.sample_change);
  this.play_button = createImg('play.png', "Play");
  this.play_button.size(70, 70);
  this.play_button.position(this.track.x_position + 100, this.track.y_position + 30);
  

  this.play_pause = () => {
    if (this.track.isPlaying === false) {
      csound.audioContext.resume();
      this.track.isPlaying = true;
      // console.log(this.isPlaying);
      csound.readScore(`i 1.${this.track.track_number} 0 -1 ${this.track.track_number}`); //${this.track.sample.cs_function}
      this.play_button.attribute('src', 'pause.png');
    } else {
      this.track.isPlaying = false;
      // console.log(this.isPlaying);
      csound.readScore(`i -1.${this.track.track_number} 0 1 ${this.track.track_number}`); //${this.track.sample.cs_function}
      this.play_button.attribute('src', 'play.png');
      this.track.effectsPanel.reset_count = 0;
      this.track.effectsPanel.reset_phase_status = 0;
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
  // this.volume_input.style('font-size:20px;');
  this.volume_input.position(this.track.x_position + 165, this.track.y_position + 106);
  this.volume_input.attribute("onclick", "this.select()");
  
  this.speed_slider = createSlider(-1, 4, 1, 0.001);
  this.speed_slider.size(100, 18);
  this.speed_slider.position(this.track.x_position + 50, this.track.y_position + 140);
  this.speed_input = createInput('',"number");
  this.speed_input.size(65,18);
  // this.speed_input.style('font-size:20px;');
  this.speed_input.position(this.track.x_position + 165, this.track.y_position + 144);
  this.speed_input.attribute("onclick", "this.select()");
  this.pitch_slider = createSlider(0.5, 1.5, 1, 0.01);
  this.pitch_slider.size(100, 18);
  this.pitch_slider.position(this.track.x_position + 50, this.track.y_position + 178);
  this.pitch_input = createInput('',"number");
  this.pitch_input.size(45,18);
  // this.pitch_input.style('font-size:20px;');
  this.pitch_input.position(this.track.x_position + 165, this.track.y_position + 182);
  this.pitch_input.attribute("onclick", "this.select()");
  this.title = createInput(this.track.sample.name);
  this.title.style('font-size:24px;');
  this.title.size(200,30);
  this.title.position(this.track.x_position + 0, this.track.y_position);
  // this.reset_count = 0;
  // this.reset_button = createButton("Reset Phase");
  // this.reset_button.position(200,400);
  // this.reset_phase_status = 0;
  // this.reset_phase = () => {
  //   this.reset_phase_status = this.reset_phase_status + 1;
  //   csound.setControlChannel("reset_phase", this.reset_phase_status);    
  // }
  // this.reset_button.mousePressed(this.reset_phase);

  // this.time_lock = createButton("Time Lock");
  // this.time_lock_status = 0;
  // this.time_lock_clicked = () => {
  //   this.time_lock_status = (this.time_lock_status + 1)%2;
  // }
  // this.time_lock.mousePressed(this.time_lock_clicked);
  // this.time_lock.position(600, 250);
  // this.time_lock_input = createInput('2', "number");
  // this.time_lock_input.position(600, 290);
  // this.time_lock_input.attribute("onclick", "this.select()");
  // this.time_lock_duration = 2;
  // this.time_lock_increment = createInput('1', "number");
  // this.time_lock_increment.position(600, 330);

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

    // csound.requestControlChannel("reset_count", () => {
    //   if (csound.getControlChannel("reset_count") !== this.reset_count && this.time_lock_status === 1) {
    //     this.reset_increment();
    //   }
    //   this.reset_count = csound.getControlChannel("reset_count");
    // });

    // if (csound) {
      csound.setControlChannel("cs_function", this.track.sample.cs_function);

      csound.setControlChannel("volume", this.volume_slider.value());
      if (this.track.effectsPanel.time_lock_status) {
        // this.time_lock_speed = (this.track.wavePanel.loop_end - this.track.wavePanel.loop_start) / (this.time_lock_duration.value()) * 44100)
        this.speed_slider.value((this.track.wavePanel.loop_end - this.track.wavePanel.loop_start) / (this.track.effectsPanel.time_lock_duration * 44100));
        // if (this.track.wavePanel.reset_count.changed()) {
        //   this.track.wavePanel.loop_start -= this.time_lock_increment.value();
        // }
        // csound.setControlChannel("speed", (this.track.wavePanel.loop_end - this.track.wavePanel.loop_start) / (this.time_lock_duration.value()) * 44100);
      // } else {
      }
      csound.setControlChannel("speed", this.speed_slider.value());
      csound.setControlChannel("pitch", this.pitch_slider.value() * this.track.effectsPanel.keyboard.current_ratio);
    // }  
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
    this.track.effectsPanel.time_lock_duration = this.track.effectsPanel.time_lock_input.value();
    this.track.effectsPanel.reset_shift_left_increment = this.track.effectsPanel.reset_shift_left_input.value();
    this.track.effectsPanel.reset_shift_right_increment = this.track.effectsPanel.reset_shift_right_input.value();
  }

  // this.reset_increment = function () {
  //   this.track.wavePanel.left_boundary.x_position -= this.time_lock_increment.value();
  // }
}

function WavePanel(track) {
  this.track = track;
  this.width = 775;
  this.height = 150;
  this.boundary_width = 14;
  this.boundary_height = this.height;
  this.x_position = this.track.x_position + 250;
  this.y_position = this.track.y_position + 10;
  this.wave_midpoint = this.y_position + (this.height / 2);
  this.left_boundary = new LoopBoundary(this.track, this.x_position - this.boundary_width, this.y_position, this.boundary_width, this.boundary_height)
  this.right_boundary = new LoopBoundary(this.track, this.x_position + this.width, this.y_position, this.boundary_width, this.boundary_height);
  this.loop_start = 0;
  this.loop_end = this.track.sample.length;
  this.playhead = 0;
  this.playhead_width = 8;
  this.playhead_height = this.boundary_height * 0.9;
  this.playhead_y_position = this.y_position + (this.height - this.playhead_height) / 2;
  this.clip_locked = false;
  this.clicked_mouse_x = 0;
  this.clicked_left_x = 0;
  this.clicked_right_x = 0;
  this.click_released = 0;
  this.loop_length = createSpan('');
  this.loop_length_hover = false;
  this.loop_length.mouseOver(() => {this.loop_length_hover = true});
  this.loop_length.mouseOut(() => {this.loop_length_hover = false});

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

    if (hover(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height + 10) || this.clip_locked || this.loop_length_hover === true) {
      noStroke();
      fill('rgba(255,255,255,0.15)');
      rect(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height);
      this.loop_length.style("background:rgba(255,255,255,0.15);")
    } else {
      this.loop_length.style("background:rgb(227, 75, 116);")
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
    text("Start: "+this.loop_start, this.track.x_position, this.track.controlPanel.height + 10);
    text("Length: " + (this.loop_end - this.loop_start), this.track.x_position, this.track.controlPanel.height + 40);
    text("End: " + this.loop_end, this.track.x_position, this.track.controlPanel.height + 70);
    text("Reset Count: " + this.track.effectsPanel.reset_count, this.track.x_position, this.track.controlPanel.height + 100);
    text("Reset Phase Status: " + this.track.effectsPanel.reset_phase_status, this.track.x_position, this.track.controlPanel.height + 130);
    
    csound.setControlChannel("loop_start", this.loop_start);
    csound.setControlChannel("loop_end", this.loop_end);
    // textAlign(CENTER);
    // text(((this.loop_end - this.loop_start) / 44100 / this.track.controlPanel.speed_slider.value()).toFixed(2) + "s", (this.left_boundary.x_position + this.right_boundary.x_position + this.boundary_width)/2, this.y_position + this.height + 5);
    // textAlign(LEFT);

    this.loop_length.html(((this.loop_end - this.loop_start) / 44100 / this.track.controlPanel.speed_slider.value()).toFixed(2) + "s");
    this.loop_length.position((this.left_boundary.x_position + this.right_boundary.x_position + this.boundary_width) / 2 - 50, this.y_position + this.height + 5);

    this.loop_start = ~~map((this.left_boundary.x_position + this.boundary_width), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
    this.loop_end = ~~map((this.right_boundary.x_position), this.x_position, this.x_position + this.width, 0, this.track.sample.length);
  }

  this.clicked = function() {
    this.clicked_mouse_x = mouseX;
    this.clicked_left_x = this.left_boundary.x_position;
    this.clicked_right_x = this.right_boundary.x_position;

    if (hover(this.left_boundary.x_position + this.boundary_width, this.y_position, this.right_boundary.x_position - (this.left_boundary.x_position + this.boundary_width), this.boundary_height) || this.loop_length_hover) {
      this.clip_locked = true;
    }
    this.left_boundary.clicked();
    this.right_boundary.clicked();
  }
  
  this.dragged = function() {
    if (this.clip_locked) {     
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
      if (this.left_boundary.x_position < this.x_position - this.boundary_width) {
        this.left_boundary.x_position = this.x_position - this.boundary_width;
      } else if (this.left_boundary.x_position + this.boundary_width > this.right_boundary.x_position - 2) {
        this.left_boundary.x_position = this.right_boundary.x_position - this.boundary_width - 2;
      }
    } else if (this.right_boundary.locked) {
      // this.loop_length_continuous = 1;
      // csound.setControlChannel("loop_length_continuous", this.loop_length_continuous);    
      this.right_boundary.x_position = mouseX - this.boundary_width/2;
      if (this.right_boundary.x_position < this.left_boundary.x_position + this.boundary_width + 2) {
        this.right_boundary.x_position = this.left_boundary.x_position + this.boundary_width + 2;
      } else if (this.right_boundary.x_position > this.x_position + this.width) {
        this.right_boundary.x_position = this.x_position + this.width;
      }
    }
  }
  
  this.released = function() {
    if (this.clip_locked) {
      if (this.track.isPlaying) {
        if (this.track.controlPanel.speed_slider.value() > 0 && this.left_boundary.x_position + this.boundary_width > this.playhead) {
          this.track.effectsPanel.reset_phase();
        } else if (this.track.controlPanel.speed_slider.value() < 0 && this.right_boundary.x_position < this.playhead) {
          this.track.effectsPanel.reset_phase();
        }
      }
    }
    this.clip_locked = false;
    this.left_boundary.released();
    this.right_boundary.released();
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

function EffectsPanel(track) {
  this.track = track;
  this.width = this.track.wavePanel.width;
  this.height = 200;
  this.x_position = this.track.wavePanel.x_position;
  this.y_position = this.track.wavePanel.y_position + this.track.wavePanel.height + 40;
  this.keyboard = new Keyboard(this);
  
  this.reset_count = 0;
  this.reset_button = createButton("Reset Phase");
  this.reset_button.position(this.x_position + 600, this.y_position);
  this.reset_phase_status = 0;
  this.reset_phase = () => {
    this.reset_phase_status = this.reset_phase_status + 1;
    csound.setControlChannel("reset_phase", this.reset_phase_status);
  }
  this.reset_button.mousePressed(this.reset_phase);
  
  this.time_lock = createButton("Time Lock");
  this.time_lock_status = false;
  this.time_lock_clicked = () => {
    if (this.time_lock_status) {
      this.time_lock_status = false;
      this.time_lock.removeClass("selected");
    } else {
      this.time_lock_status = true;
      this.time_lock.class("selected");
    }
  }
  this.time_lock.mousePressed(this.time_lock_clicked);
  this.time_lock.position(this.x_position + this.keyboard.width, this.y_position);
  this.time_lock_input = createInput('2', "number");
  this.time_lock_input.position(this.x_position + this.keyboard.width, this.y_position + 40);
  this.time_lock_input.attribute("onclick", "this.select()");
  this.time_lock_duration = 2;

  this.reset_shift = createButton("Reset Shift");
  this.reset_shift.position(this.x_position + this.keyboard.width + 150, this.y_position);
  this.reset_shift_left_input = createInput('1', "number");
  this.reset_shift_left_input.position(this.x_position + this.keyboard.width + 150, this.y_position + 40);
  this.reset_shift_left_input.attribute("onclick", "this.select()");
  this.reset_shift_left_increment = 1;
  this.reset_shift_right_input = createInput('1', "number");
  this.reset_shift_right_input.position(this.x_position + this.keyboard.width + 180, this.y_position + 40);
  this.reset_shift_right_input.attribute("onclick", "this.select()");
  this.reset_shift_right_increment = 1;
  this.reset_shift_status = false;
  this.reset_shift_clicked = () => {
    if (this.reset_shift_status) {
      this.reset_shift_status = false;
      this.reset_shift.removeClass("selected");
    } else {
      this.reset_shift_status = true;
      this.reset_shift.class("selected");
    }
  }
  this.reset_shift.mousePressed(this.reset_shift_clicked);


  this.display = function() {
    csound.requestControlChannel("reset_count", () => {
      if (this.track.isPlaying) {
        if (csound.getControlChannel("reset_count") !== this.reset_count && this.reset_shift_status) {
          this.reset_increment();
        }
        this.reset_count = csound.getControlChannel("reset_count");
      }
    });
  }

  this.reset_increment = function () {
    this.track.wavePanel.left_boundary.x_position += parseFloat(this.reset_shift_left_increment);
    this.track.wavePanel.right_boundary.x_position += parseFloat(this.reset_shift_right_increment);
  }
}

function Keyboard(effectsPanel) {
  this.effectsPanel = effectsPanel;
  this.width = 300;
  this.x_offset = 18;
  this.y_offset = 36;
  this.keys = [];
  this.keys.push(new Key(this, 0, 1, 1));
  this.keys.push(new Key(this, 1, 0, 1.059463));
  this.keys.push(new Key(this, 2, 1, 1.122462));
  this.keys.push(new Key(this, 3, 0, 1.189207));
  this.keys.push(new Key(this, 4, 1, 1.259921));
  this.keys.push(new Key(this, 6, 1, 1.33484));
  this.keys.push(new Key(this, 7, 0, 1.414214 ));
  this.keys.push(new Key(this, 8, 1, 1.498307));
  this.keys.push(new Key(this, 9, 0, 1.587401));
  this.keys.push(new Key(this, 10, 1, 1.681793));
  this.keys.push(new Key(this, 11, 0, 1.781797));
  this.keys.push(new Key(this, 12, 1, 1.887749));
  this.keys.push(new Key(this, 14, 1, 2));
  this.current_ratio = 1;

  this.display = function() {

  }

  this.update_keys = function(clicked_key) {
    this.keys.forEach(key => {
      if (key.button_clicked === true) {
        key.button.class("selected");
        this.current_ratio = key.ratio;
        key.button_clicked = false;
      } else {
        key.button.removeClass("selected");
      }
    });
  }
}

function Key(keyboard, x, y, ratio) {
  this.keyboard = keyboard;
  this.ratio = ratio;
  this.button = createButton("");
  this.button.size(30, 30);
  this.button.position(this.keyboard.effectsPanel.x_position + this.keyboard.x_offset * x, this.keyboard.effectsPanel.y_position + this.keyboard.y_offset * y);
  this.button_clicked = false;

  this.button.clicked = () => {
    this.button_clicked = true;
    this.keyboard.update_keys(this.button);
  }
  
  this.button.mousePressed(this.button.clicked);
}
