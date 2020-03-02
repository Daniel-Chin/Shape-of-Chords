const PADDING = 20;

function setup() {
  const radius = windowHeight * .8;
  createCanvas(radius, radius)
    .parent('canvas-div');
  canvas.start();
}

function draw() {
  handleAmpRotate();
  for (let i = 0; i < parameters.trace_multi; i ++) {
    canvas.draw();
  }
}

const debug = () => {
  piano.setActivation(60, 1);
  piano.setActivation(67, 1);
};

const userInteract = () => {
  document.getElementById('welcome').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  const head = document.getElementById('head');
  const p5Script = document.createElement('script');
  head.appendChild(p5Script);
  p5Script.onload = () => {
    const sound = document.createElement('script');
    head.appendChild(sound);
    sound.onload = () => {
      for (let i = 0; i < 128; i ++) {
        piano.sine.push(new p5.Oscillator('sine'));
      }
      onMenuChange();
    };
    sound.src = 'p5.sound.min.js';
  };
  p5Script.src = 'p5.min.js';
  if (window.innerWidth > 700) {
    buildPiano(60 - 24, 60 + 24);
  } else {
    if (window.innerWidth > 380) {
      buildPiano(60 - 12, 60 + 12);
    } else {
      buildPiano(60, 60 + 12);
    }
  }
};
