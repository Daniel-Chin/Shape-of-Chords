const piano = {
  C4: 261.6255653005986, 
  JUSTIN_ARRAY: [
    1,      // 0
    19/17,
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
    piano.activation[pitch] = value;
    const mySine = piano.sine[pitch];
    const freq = round(piano.pitchToFreq(pitch));
    piano.amp[pitch] = value * piano.freqEnergyPenalty(freq);
    mySine.amp(piano.amp[pitch]);
    if (value) {
      mySine.freq(freq);
      mySine.start();
    } else {
      mySine.stop();
    }
    if (! keep_canvas) {
      canvas.start();
    }
  },

  clearActivation: () => {
    for (let i = 0; i < 128; i ++) {
      piano.setActivation(i, 0, true);
    }
    canvas.start();
  }, 

  freqEnergyPenalty: (freq) => (
    32.75 / freq
  ),
}
