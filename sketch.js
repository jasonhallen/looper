let isPlaying = false;
let samples_peaks = [];
let track_list = [];
// let lbx, lby, rbx, rby;
let loading_img;
let mixer;
let track_number = 0;
let track_unique_id = 1;
let trigger_status = false;

function preload() {
  roboto = loadFont('OverpassMono-Bold.ttf');
  loading_image = loadImage('loading.gif');
  // add_image = loadImage('add.png');
}

function setup() {
  createCanvas(displayWidth, 4000);
  background(227, 75, 116);
  loading_image.resize(300, 300);
  textFont(roboto);
  textAlign(LEFT,TOP);
  add_button = createImg("add.png", "Add");
  add_button.mouseClicked(add_track);
  add_button.size(70, 70);
  add_button.hide();
  mixer = new Mixer();
}

function draw() {
  background(227,75,116);
  fill(255);
  
  if (!sample_list[0]) {
    image(loading_image,450,150);
  } else if (sample_list[0]) {
    if (!track_list[0]) { 
      add_button.position(50, 50);
      add_button.show();
      textSize(70);
      text("add track", 150, 36);
    } else {
      textSize(24); 
      mixer.display();
      add_button.position(50, track_list.length * 225 + 25);
      track_list.forEach(track => track.display());
    }
  }
}

function add_track() {
  track_list.push(new Track());
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
  }2
  if (keyCode === 192) {
    trigger_status = true;
    document.activeElement.blur();
  }
  if (trigger_status && keyCode === 49) {
    trigger_sample(0);
  } else if (trigger_status && keyCode === 50) {
    trigger_sample(1);
  } else if (trigger_status && keyCode === 51) {
    trigger_sample(2);
  } else if (trigger_status && keyCode === 52) {
    trigger_sample(3);
  } else if (trigger_status && keyCode === 53) {
    trigger_sample(4);
  }
}

function keyReleased() {
  if (keyCode === 192) {
    trigger_status = false;
  }
}

function trigger_sample(track) {
  if (track_list[track].controlPanel.mode_status === 1) {
    track_list[track].controlPanel.play_pause();
  } else {
    if (track_list[track].isPlaying) {
      // csound.readScore(`i 2 0 1 1.${track_list[0].id}`);
      // csound.readScore(`i 1.${track_list[0].id} 0 3600 ${track_list[0].id} 0`);
      track_list[track].effectsPanel.reset_phase();
    } else {
      track_list[track].controlPanel.play_pause();
    }
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

function Track() {
  this.width = 1200;
  this.height = 225;
  this.track_position = track_number;
  track_number += 1;
  this.x_position = 20;
  this.y_position = this.height * this.track_position + 10;
  this.id = track_unique_id;
  track_unique_id += 1;
  sample_list.sort((a, b) => (a.name > b.name) ? 1 : -1);
  this.sample = sample_list[0];
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
  this.sample_change = () => {
    this.track.sample = sample_list.find(element => element.name === this.sample_select.value());
  }
  this.sample_select.changed(this.sample_change);
  this.play_button = createImg('play.png', "Play");
  this.play_button.size(70, 70);  

  this.play_pause = () => {
    if (this.track.isPlaying === false) {
      csound.audioContext.resume();
      this.track.isPlaying = true;
      // console.log(this.isPlaying);
      csound.readScore(`i 1.${this.track.id} 0 3600 ${this.track.id} 0`); //${this.track.sample.cs_function}
      this.play_button.attribute('src', 'pause.png');
    } else {
      // if (this.mode_end == 1) {
        this.track.isPlaying = false;
      // }
      // console.log(this.isPlaying);
      // csound.readScore(`i -1.${this.track.id} 0 1 ${this.track.id} 0`); //${this.track.sample.cs_function}
      if (this.mode_status === 1) {
        csound.readScore(`i 2 0 1 1.${this.track.id}`); //${this.track.sample.cs_function}
      }
      // csound.evaluateCode(`turnoff2 1.${this.track.id}, 4, 0`);
      // csound.readScore(`i -2 0 1 ${this.track.id}`); //${this.track.sample.cs_function}
      this.play_button.attribute('src', 'play.png');
      // this.track.effectsPanel.reset_count = 0;
      this.track.effectsPanel.reset_phase_status = 0;
      // this.track.wavePanel.playhead = this.track.wavePanel.left_boundary.x_position + (this.track.wavePanel.boundary_width - this.track.wavePanel.playhead_width / 2);
    }
  }
  
  this.play_button.mousePressed(this.play_pause); //function() => {this.play_pause();}); //this.play_pause);
  // play_button.style('font-family:roboto;font-size:24px;background:white;');
  // play_button.style("font-size", "24px");
  // this.mute_button = createButton("Mute");
  
  this.delete_button = createImg('delete.png', "Delete");
  this.delete_button.size(30, 30);

  this.delete = () => {
    if (this.track.isPlaying === true) {
      csound.readScore(`i 2 0 1 1.${this.track.id}`);
      csound.readScore(`i -998.${this.track.id} 0 1 ${this.track.id}`);
    }
    this.sample_select.remove();
    this.play_button.remove();
    this.volume_slider.remove();
    this.volume_input.remove();
    this.pan_slider.remove();
    this.pan_input.remove();
    this.speed_slider.remove();
    this.speed_input.remove();
    this.pitch_slider.remove();
    this.pitch_input.remove();
    this.delete_button.remove();
    this.mode_button.remove();
    this.track.wavePanel.loop_length.remove();
    this.track.effectsPanel.keyboard.remove();
    this.track.effectsPanel.time_lock.remove();
    this.track.effectsPanel.time_lock_input.remove();
    this.track.effectsPanel.reset_shift.remove();
    this.track.effectsPanel.reset_shift_left_input.remove();
    this.track.effectsPanel.reset_shift_right_input.remove();
    this.track.effectsPanel.crossfade_duration.remove();
    this.track.effectsPanel.delay_button.remove();
    this.track.effectsPanel.delay_mix.remove();
    this.track.effectsPanel.reverb_button.remove();
    this.track.effectsPanel.reverb_mix.remove();

    track_list.splice(this.track.track_position, 1);
    var temp_position = 0;
    track_list.forEach(track => {
      track.track_position = temp_position;
      temp_position += 1;
      track.y_position = track.height * track.track_position + 10;
      track.controlPanel.update_position();
      track.wavePanel.y_position = track.y_position;
      track.wavePanel.wave_midpoint = track.wavePanel.y_position + (track.wavePanel.height / 2);
      track.wavePanel.left_boundary.y_position = track.wavePanel.y_position;
      track.wavePanel.right_boundary.y_position = track.wavePanel.y_position;
      track.wavePanel.playhead_y_position = track.wavePanel.y_position + (track.wavePanel.height - track.wavePanel.playhead_height) / 2;
      track.effectsPanel.y_position = track.wavePanel.y_position + track.wavePanel.height + 30;
      track.effectsPanel.update_position();
      track.effectsPanel.keyboard.update_position();
    });
    track_number -= 1;
  }

  this.delete_button.mousePressed(this.delete);
  this.volume_slider = createSlider(0, 2, 0.5, 0.01);
  this.volume_slider.size(100, 10);
  csound.setControlChannel(`volume${this.track.id}`, this.volume_slider.value());
  this.volume_slider.attribute("oninput",`csound.setControlChannel('volume${this.track.id}', this.value)`);
  this.volume_input = createInput('',"number");
  this.volume_input.size(45,18);
  // this.volume_input.style('font-size:20px;');
  this.volume_input.attribute("onclick", "this.select()");
  this.pan_slider = createSlider(0, 1, 0.5, 0.01);
  this.pan_slider.size(100, 10);
  csound.setControlChannel(`pan${this.track.id}`, this.pan_slider.value());
  this.pan_slider.attribute("oninput",`csound.setControlChannel('pan${this.track.id}', this.value)`);
  this.pan_input = createInput('',"number");
  this.pan_input.size(65,18);
  // this.pan_input.style('font-size:20px;');
  this.pan_input.attribute("onclick", "this.select()");
  this.speed_slider = createSlider(-1, 4, 1, 0.001);
  this.speed_slider.size(100, 10);
  this.speed_input = createInput('',"number");
  this.speed_input.size(65,18);
  // this.speed_input.style('font-size:20px;');
  this.speed_input.attribute("onclick", "this.select()");
  this.pitch_slider = createSlider(-12, 12, 0, 0.01);
  this.pitch_slider.size(100, 10);
  csound.setControlChannel(`pitch${this.track.id}`, this.pitch_slider.value());
  this.pitch_slider.attribute("oninput", `csound.setControlChannel('pitch${this.track.id}', this.value)`);
  this.pitch_input = createInput('',"number");
  this.pitch_input.size(65,18);
  // this.pitch_input.style('font-size:20px;');
  this.pitch_input.attribute("onclick", "this.select()");
  this.mode_button = createButton("Loop");
  this.mode_status = 1;
  csound.setControlChannel(`mode${this.track.id}`, this.mode_status);
  this.mode_button.class("selected");
  this.mode_clicked = () => {
    if (this.mode_status) {
      this.mode_status = 0;
      this.mode_button.removeClass("selected");
    } else {
      this.mode_status = 1;
      this.mode_button.class("selected");
    }
    csound.setControlChannel(`mode${this.track.id}`, this.mode_status);
  }
  this.mode_button.mousePressed(this.mode_clicked);
  this.mode_end = 0;
  this.mode_end_next = 0;

  this.update_position = function () {
    this.sample_select.position(this.track.x_position, this.track.y_position);
    this.play_button.position(this.track.x_position + 92, this.track.y_position + 35);
    this.delete_button.position(this.track.x_position + 185, this.track.y_position + 3);
    this.volume_slider.position(this.track.x_position + 50, this.track.y_position + 105);
    this.volume_input.position(this.track.x_position + 165, this.track.y_position + 106);
    this.pan_slider.position(this.track.x_position + 50, this.track.y_position + 130);
    this.pan_input.position(this.track.x_position + 165, this.track.y_position + 131);
    this.speed_slider.position(this.track.x_position + 50, this.track.y_position + 155);
    this.speed_input.position(this.track.x_position + 165, this.track.y_position + 156);
    this.pitch_slider.position(this.track.x_position + 50, this.track.y_position + 180);
    this.pitch_input.position(this.track.x_position + 165, this.track.y_position + 181);
    this.mode_button.position(this.track.x_position + 175, this.track.y_position + 40);
  }

  this.update_position();

  this.display = function() {
    textSize(50);
    text("[" + (this.track.track_position + 1) + "]", this.track.x_position - 9, this.track.y_position + 37);
    textSize(20);
    text("Vlm", this.track.x_position, this.track.y_position + 105);
    // this.volume_input.value(this.volume_slider.value());
    text("Pan", this.track.x_position, this.track.y_position +130);
    text("Spd", this.track.x_position, this.track.y_position + 155);
    // this.speed_input.value(this.speed_slider.value());
    text("Ptc", this.track.x_position, this.track.y_position + 180);
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
    csound.setControlChannel(`cs_function${this.track.id}`, this.track.sample.cs_function);

    // csound.setControlChannel(`volume${this.track.id}`, this.volume_slider.value());
    if (this.track.effectsPanel.time_lock_status) {
      this.speed_slider.value((this.track.wavePanel.loop_end - this.track.wavePanel.loop_start) / (this.track.effectsPanel.time_lock_duration * 44100));
    }
    csound.setControlChannel(`speed${this.track.id}`, this.speed_slider.value());
    // csound.setControlChannel(`pitch${this.track.id}`, this.pitch_slider.value() + this.track.effectsPanel.keyboard.current_ratio);
    // csound.setControlChannel(`pan${this.track.id}`, this.pan_slider.value());
    // csound.setControlChannel(`mode${this.track.id}`, this.mode_status);

    if (this.track.isPlaying && this.mode_status === 0) {
      csound.requestControlChannel(`mode_end${this.track.id}`, () => this.mode_end_next = csound.getControlChannel(`mode_end${this.track.id}`));
      if (this.mode_end === 0 && this.mode_end_next === 1) {
        this.play_pause();
      }
      this.mode_end = this.mode_end_next;
    }
  }

  this.clicked = function() {
    this.volume_input.value(~~map(this.volume_slider.value(),0,2,0,100));
    this.speed_input.value(this.speed_slider.value());
    this.pitch_input.value(this.pitch_slider.value());
    this.pan_input.value(this.pan_slider.value());
  }

  this.dragged = function() {
    this.volume_input.value(~~map(this.volume_slider.value(), 0, 2, 0, 100));
    this.speed_input.value(this.speed_slider.value());
    this.pitch_input.value(this.pitch_slider.value());
    this.pan_input.value(this.pan_slider.value());
  }

  this.update_sliders = function() {
    this.volume_slider.value(map(this.volume_input.value(), 0, 100, 0, 2));
    csound.setControlChannel(`volume${this.track.id}`, this.volume_slider.value());
    this.speed_slider.value(this.speed_input.value());
    csound.setControlChannel(`speed${this.track.id}`, this.speed_slider.value());
    this.pitch_slider.value(this.pitch_input.value());
    csound.setControlChannel(`pitch${this.track.id}`, this.pitch_slider.value());
    this.pan_slider.value(this.pan_input.value());
    csound.setControlChannel(`pan${this.track.id}`, this.pan_slider.value());
    this.track.effectsPanel.time_lock_duration = this.track.effectsPanel.time_lock_input.value();
    this.track.effectsPanel.reset_shift_left_increment = this.track.effectsPanel.reset_shift_left_input.value();
    this.track.effectsPanel.reset_shift_right_increment = this.track.effectsPanel.reset_shift_right_input.value();
  }
}

function WavePanel(track) {
  this.track = track;
  this.width = 775;
  this.height = 100;
  this.boundary_width = 14;
  this.boundary_height = this.height;
  this.x_position = this.track.x_position + 250;
  this.y_position = this.track.y_position;
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
      csound.requestControlChannel(`playhead${this.track.id}`, () => this.playhead = map(csound.getControlChannel(`playhead${this.track.id}`), 0, this.track.sample.length, this.x_position, this.x_position + this.width));
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
    // text("Start: "+this.loop_start, this.track.x_position, this.track.controlPanel.height + 10);
    // text("Length: " + (this.loop_end - this.loop_start), this.track.x_position, this.track.controlPanel.height + 40);
    // text("End: " + this.loop_end, this.track.x_position, this.track.controlPanel.height + 70);
    // text("Reset Count: " + this.track.effectsPanel.reset_count, this.track.x_position, this.track.controlPanel.height + 100);
    // text("Reset Phase Status: " + this.track.effectsPanel.reset_phase_status, this.track.x_position, this.track.controlPanel.height + 130);
    
    csound.setControlChannel(`loop_start${this.track.id}`, this.loop_start);
    csound.setControlChannel(`loop_end${this.track.id}`, this.loop_end);
    // textAlign(CENTER);
    // text(((this.loop_end - this.loop_start) / 44100 / this.track.controlPanel.speed_slider.value()).toFixed(2) + "s", (this.left_boundary.x_position + this.right_boundary.x_position + this.boundary_width)/2, this.y_position + this.height + 5);
    // textAlign(LEFT);

    this.loop_length.html(((this.loop_end - this.loop_start) / 44100 / this.track.controlPanel.speed_slider.value()).toFixed(2) + "s");
    this.loop_length.position((this.left_boundary.x_position + this.right_boundary.x_position + this.boundary_width) / 2 - 50, this.y_position + this.height);

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
    // if (this.clip_locked) {
      if (this.track.isPlaying) {
        if (this.track.controlPanel.speed_slider.value() > 0 && this.left_boundary.x_position + this.boundary_width/2 > this.playhead) {
          this.track.effectsPanel.reset_phase();
        } else if (this.track.controlPanel.speed_slider.value() < 0 && this.right_boundary.x_position < this.playhead) {
          this.track.effectsPanel.reset_phase();
        }
      }
    // }
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
  this.y_position = this.track.wavePanel.y_position + this.track.wavePanel.height + 30;
  this.keyboard = new Keyboard(this);
  
  this.reset_count = 0;
  // this.reset_button = createButton("Reset Phase");
  // this.reset_button.position(this.x_position + 600, this.y_position);
  this.reset_phase_status = 0;
  this.reset_phase = () => {
    this.reset_phase_status = this.reset_phase_status + 1;
    csound.setControlChannel(`reset_phase${this.track.id}`, this.reset_phase_status);
  }
  // this.reset_button.mousePressed(this.reset_phase);
  
  this.time_lock = createButton("Lock");
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
  this.time_lock_input = createInput('2', "number");
  this.time_lock_input.attribute("onclick", "this.select()");
  this.time_lock_duration = 2;

  this.reset_shift = createButton("Shift");
  this.reset_shift_left_input = createInput('1', "number");
  this.reset_shift_left_input.size(30,20);
  this.reset_shift_left_input.attribute("onclick", "this.select()");
  this.reset_shift_left_increment = 1;
  this.reset_shift_right_input = createInput('1', "number");
  this.reset_shift_right_input.size(30,20);
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

  this.crossfade_duration = createSlider(0.02, 0.5, 0.05, 0.01);
  this.crossfade_duration.size(100, 10);
  this.crossfade_out = 0;

  this.delay_button = createButton("Delay");
  this.delay_status = 0;
  this.delay_clicked = () => {
    if (this.delay_status === 1) {
      csound.readScore(`i -998.${this.track.id} 0 1 ${this.track.id}`);
      this.delay_status = 0;
      this.delay_button.removeClass("selected");
    } else {
      csound.readScore(`i 998.${this.track.id} 0 -1 ${this.track.id}`);
      this.delay_status = 1;
      this.delay_button.class("selected");
    }
  }
  this.delay_button.mousePressed(this.delay_clicked);
  this.delay_mix = createSlider(0, 1, 0, 0.01);
  this.delay_mix.size(100, 10);

  this.reverb_button = createButton("Reverb");
  this.reverb_status = 0;
  this.reverb_clicked = () => {
    if (this.reverb_status === 1) {
      this.reverb_status = 0;
      this.reverb_button.removeClass("selected");
    } else {
      this.reverb_status = 1;
      this.reverb_button.class("selected");
    }
  }
  this.reverb_button.mousePressed(this.reverb_clicked);
  this.reverb_mix = createSlider(0, 1, 0, 0.01);
  this.reverb_mix.size(100, 10);

  this.update_position = function() {
    this.time_lock.position(this.x_position + this.keyboard.width, this.y_position);
    this.time_lock_input.position(this.x_position + this.keyboard.width + 55, this.y_position);
    this.reset_shift.position(this.x_position + this.keyboard.width + 120, this.y_position);
    this.reset_shift_left_input.position(this.x_position + this.keyboard.width + 200, this.y_position + 2);
    this.reset_shift_right_input.position(this.x_position + this.keyboard.width + 260, this.y_position + 2);
    this.crossfade_duration.position(this.x_position + 645, this.y_position);
    this.delay_button.position(this.x_position + this.keyboard.width, this.y_position + 36);
    this.delay_mix.position(this.x_position + this.keyboard.width + 70, this.y_position + 40);
    this.reverb_button.position(this.x_position + this.keyboard.width + 210, this.y_position + 36);
    this.reverb_mix.position(this.x_position + this.keyboard.width + 290, this.y_position + 40);
  }

  this.update_position();

  this.display = function() {
    csound.requestControlChannel(`reset_count${this.track.id}`, () => {
      if (this.track.isPlaying) {
        if (csound.getControlChannel(`reset_count${this.track.id}`) > this.reset_count && this.reset_shift_status) {
          this.reset_increment();
        }
        this.reset_count = csound.getControlChannel(`reset_count${this.track.id}`);
      }
    });
    csound.setControlChannel(`crossfade_duration${this.track.id}`, this.crossfade_duration.value()*44100);
    textSize(16);
    text("L:", this.x_position + this.keyboard.width + 180, this.y_position + 3);
    text("R:", this.x_position + this.keyboard.width + 240, this.y_position + 3);
    text("Fade", this.x_position + 600, this.y_position + 3);
    text(this.crossfade_duration.value(), this.x_position + 760, this.y_position);
    csound.setControlChannel(`reverb_status${this.track.id}`, this.reverb_status);
    csound.setControlChannel(`reverb_mix${this.track.id}`, this.reverb_mix.value());
    csound.setControlChannel(`delay_status${this.track.id}`, this.delay_status);
    csound.setControlChannel(`delay_mix${this.track.id}`, this.delay_mix.value());

    // csound.requestControlChannel("crossfade_out", () => this.crossfade_out = csound.getControlChannel("crossfade_out"));
    // console.log(this.crossfade_out);
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
  this.keys.push(new Key(this, 0, 1, 0)); //1
  this.keys.push(new Key(this, 1, 0, 1)); //1.059463
  this.keys.push(new Key(this, 2, 1, 2)); //1.122462
  this.keys.push(new Key(this, 3, 0, 3)); //1.189207
  this.keys.push(new Key(this, 4, 1, 4)); //1.259921
  this.keys.push(new Key(this, 6, 1, 5)); //1.33484
  this.keys.push(new Key(this, 7, 0, 6)); //1.414214
  this.keys.push(new Key(this, 8, 1, 7)); //1.498307
  this.keys.push(new Key(this, 9, 0, 8)); //1.587401
  this.keys.push(new Key(this, 10, 1, 9)); //1.681793
  this.keys.push(new Key(this, 11, 0, 10)); //1.781797
  this.keys.push(new Key(this, 12, 1, 11)); //1.887749
  this.keys.push(new Key(this, 14, 1, 12)); //2
  this.current_ratio = 0;

  this.update_position = function() {
    this.keys.forEach(key => {
      key.button.position(this.effectsPanel.x_position + this.x_offset * key.x, this.effectsPanel.y_position + this.y_offset * key.y);
    });
  }

  this.update_position();

  this.display = function() {

  }

  this.update_keys = function(clicked_key) {
    this.keys.forEach(key => {
      if (key.button_clicked === true) {
        key.button.class("selected");
        this.current_ratio = key.ratio;
        csound.setControlChannel(`pitch${this.effectsPanel.track.id}`, this.effectsPanel.track.controlPanel.pitch_slider.value() + this.current_ratio);
        key.button_clicked = false;
      } else {
        key.button.removeClass("selected");
      }
    });
  }

  this.remove = function() {
    this.keys.forEach(key => {
      key.button.remove();
    });
  }

}

function Key(keyboard, x, y, ratio) {
  this.keyboard = keyboard;
  this.x = x;
  this.y = y;
  this.ratio = ratio;
  this.button = createButton("");
  this.button.size(30, 30);
  // this.button.position(this.keyboard.effectsPanel.x_position + this.keyboard.x_offset * x, this.keyboard.effectsPanel.y_position + this.keyboard.y_offset * this.y);
  this.button_clicked = false;

  this.button.clicked = () => {
    this.button_clicked = true;
    this.keyboard.update_keys(this.button);
  }
  
  this.button.mousePressed(this.button.clicked);
}

function Mixer() {
  this.width = 200;
  this.height = 3000;
  this.x_position = 1100;
  this.y_position = 30;
  this.main_volume_slider = createSlider(0, 1.5, 1, 0.01);
  this.main_volume_slider.size(200, 18);
  this.main_volume_slider.position(this.x_position + 50, this.y_position + 140);
  this.main_volume_slider.style('transform: rotate(270deg);');
  this.left_meter = 0;
  this.right_meter = 0;

  // this.main_reverb_button = createButton("Reverb");
  // this.main_reverb_status = 0;
  // this.main_reverb_clicked = () => {
  //   if (this.main_reverb_status === 1) {
  //     this.main_reverb_status = 0;
  //     this.main_reverb_button.removeClass("selected");
  //     // csound.readScore("i -999 0 1");
  //   } else {
  //     this.main_reverb_status = 1;
  //     this.main_reverb_button.class("selected");
  //     // csound.readScore("i 999 0 -1");
  //   }
  // }
  // this.main_reverb_button.mousePressed(this.main_reverb_clicked);
  // this.main_reverb_button.position(this.x_position, this.y_position + 300);
  // this.main_reverb_mix = createSlider(0,1,0.5,0.01);
  // this.main_reverb_mix.size(100,18);
  // this.main_reverb_mix.position(this.x_position + 100, this.y_position + 340);
  
  this.main_reverb_size = createSlider(0,1,0.5,0.01);
  this.main_reverb_size.size(100,18);
  this.main_reverb_size.position(this.x_position + 100, this.y_position + 340);
  this.main_reverb_cutoff = createSlider(0,1,0.5,0.01);
  this.main_reverb_cutoff.size(100,18);
  this.main_reverb_cutoff.position(this.x_position + 100, this.y_position + 370);
  this.main_delay_time = createSlider(0.1,1,0.5,0.01);
  this.main_delay_time.size(100,18);
  this.main_delay_time.position(this.x_position + 100, this.y_position + 450);

  this.display = function() {
    text("MIXER",this.x_position, this.y_position);
    csound.setControlChannel("main_volume", this.main_volume_slider.value());
    // csound.setControlChannel("main_reverb_status", this.main_reverb_status);
    // csound.setControlChannel("main_reverb_mix", this.main_reverb_mix.value());
    text(this.main_volume_slider.value(), this.x_position + 130, this.y_position + 260);
    text("L", this.x_position, this.y_position + 260);
    text("R", this.x_position + 70, this.y_position + 260);
    text("REVERB", this.x_position, this.y_position + 300);
    text("Size", this.x_position, this.y_position + 340);
    text("Cutoff", this.x_position, this.y_position + 370);
    csound.setControlChannel("main_reverb_size", this.main_reverb_size.value());
    csound.setControlChannel("main_reverb_cutoff", this.main_reverb_cutoff.value());
    text("DELAY", this.x_position, this.y_position + 420);
    text("Time", this.x_position, this.y_position + 450);
    csound.setControlChannel("main_delay_time", this.main_delay_time.value());
    
    csound.requestControlChannel("left_meter", () => this.left_meter = csound.getControlChannel("left_meter"));
    csound.requestControlChannel("right_meter", () => this.right_meter = csound.getControlChannel("right_meter"));
    fill(255);
    rect(this.x_position, this.y_position + 260, 26, -210);
    rect(this.x_position + 70, this.y_position + 260, 26, -210);
    push();
    fill('rgba(227,196,100,1)');
    rect(this.x_position, this.y_position + 260, 26, map(this.left_meter, 0, 1.5, 0, -210));
    rect(this.x_position + 70, this.y_position + 260, 26, map(this.left_meter, 0, 1.5, 0, -210));
    fill('rgba(52, 184, 227, 0.7)');
    rect(this.x_position, this.y_position + 260 - 140, 26, 10);
    rect(this.x_position + 70, this.y_position + 260 - 140, 26, 10);
    pop();
  }
}