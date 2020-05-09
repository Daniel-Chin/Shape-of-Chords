const piano = {
  C4: 261.6255653005986, 
  JUSTIN_ARRAY: [
    1,      // 0
    18/17,
    9/8,
    6/5,
    5/4,
    4/3,    // 5
    7/5,
    3/2,    // 7
    8/5,
    5/3,
    7/4,
    17/9,
    2,      // 12
  ], 

  activation: new Array(128).fill(0),
  amp: new Array(128).fill(0),
  sine: [],

  pitchToFreq: (pitch) => {
    if (parameters.justin) {
      let octave = 0;
      let offset = pitch - 60;
      while (offset > +12) {
        offset -= 12;
        octave ++;
      }
      while (offset < -12) {
        offset += 12;
        octave --;
      }
      let result = piano.C4;
      if (offset > 0) {
        result *= piano.JUSTIN_ARRAY[offset];
      } else {
        result /= piano.JUSTIN_ARRAY[- offset];
      }
      if (octave !== 0){
        result *= 2 ** octave;
      }
      return result;
    } else {
      return exp(pitch / 17.312340490667562 + 2.1011784386926218);
    }
  },

  setActivation: (pitch, value, keep_canvas) => {
    value = round(value);
    piano.activation[pitch] = value;
    const mySine = piano.sine[pitch];
    const freq = round(piano.pitchToFreq(pitch));
    piano.amp[pitch] = value * piano.freqEnergyPenalty(freq);
    if (! keep_canvas) {
      if (value) {
        mySine.freq(freq);
        mySine.amp(piano.amp[pitch]);
        mySine.start();
      } else {
        mySine.stop();
      }
      canvas.start();
    }
    const keyboardKey = document.getElementById(`key-${pitch}`);
    if (keyboardKey) {
      let original_height;
      if (keyboardKey.classList.contains('white-key')) {
        original_height = 50;
      } else {
        original_height = 30;
      }
      if (value) {
        keyboardKey.style.backgroundColor = 'cyan';
        keyboardKey.style.height = `${ceil(original_height * value / 100)}px`;
      } else {
        keyboardKey.style.backgroundColor = null;
        keyboardKey.style.height = `${original_height}px`;
      }
    }
  },

  clearActivation: () => {
    for (let i = 0; i < 128; i ++) {
      piano.setActivation(i, 0);
    }
  }, 

  freqEnergyPenalty: (freq) => (
    .3275 / freq
  ),
}
