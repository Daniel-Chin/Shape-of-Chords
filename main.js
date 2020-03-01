const PADDING = 20;

function setup() {
  const radius = windowHeight * .8;
  createCanvas(radius, radius)
    .parent('canvas-div');
  canvas.start();
}

function draw() {
  canvas.draw();
}

const debug = () => {
  piano.setActivation(60, 1);
  piano.setActivation(67, 1);
};

const userInteract = () => {
  document.getElementById('play-button').style.display = 'none';
  document.getElementById('main').style.visibility = 'visible';
  onMenuClick();
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
      debug();
    };
    sound.src = 'p5.sound.min.js';
  };
  p5Script.src = 'p5.min.js';
};
