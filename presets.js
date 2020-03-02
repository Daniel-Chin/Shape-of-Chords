let category;

const getSelected = (menu_name) => {
  const radio = document.querySelector(`input[name="${menu_name}"]:checked`);
  if (radio) {
    return radio.value
  } else {
    return null;
  }
};

const onMenuChange = () => {
  const f = (x) => {
    if (x) return 'block';
    return 'none';
  }
  category = getSelected('category');
  document.getElementById('note-menu').style.display = f(
    category === 'note'
  );
  document.getElementById('interval-menu').style.display = f(
    category === 'interval'
  );
  const is_chord = category === 'chord';
  document.getElementById('chord-menu').style.display = f(
    is_chord
  );
  document.getElementById('negative-menu').style.display = f(
    category && ! is_chord
  );
  document.getElementById('inversion-menu').style.display = f(
    is_chord
  );
  if (category) {
    usePreset(is_chord);
  }
};

const usePreset = (is_chord) => {
  const chord = getSelected(category);
  if (chord === null) return;
  let negative; let inversion;
  if (is_chord) {
    inversion = parseInt(getSelected('inversion'));
    if (isNaN(inversion)) return;
  } else {
    negative = parseInt(getSelected('negative'));
    if (isNaN(negative)) return;
  }
  piano.clearActivation();
  amp_rotate.keys = [60];
  switch (category) {
    case 'note':
      piano.setActivation(60 + parseInt(chord) * negative, 100);
      break;
    case 'interval':
      piano.setActivation(60, 100);
      const other = 60 + parseInt(chord) * negative;
      piano.setActivation(other, 100);
      amp_rotate.keys.push(other);
      break;
    case 'chord':
      const components = {
        maj: [4, 7], 
        min: [3, 7], 
        aug: [4, 8], 
        dim: [3, 6], 
        "7               ": [4, 7, 10], 
        "Maj7            ": [4, 7, 11], 
        "Maj9            ": [4, 7, 11, 14], 
        "Add2            ": [2, 4, 7], 
        "MinAdd2         ": [2, 3, 7], 
        "11(omit3, omit5)": [10, 14, 17], 
        "13              ": [4, 10, 21], 
        "sus4            ": [5, 7], 
        "sus2            ": [2, 7], 
        "Maj13(#11)      ": [4, 7, 11, 14, 18, 21], 
      }[chord];
      while (inversion > 1) {
        inversion --;
        components.unshift(components.pop() - 12);
      }
      piano.setActivation(60, 100);
      components.forEach((offset) => {
        piano.setActivation(60 + offset, 100);
        amp_rotate.keys.push(60 + offset);
      });
      break;
  }
};

let amp_rotate = {
  keys: [], 
  progress: 0,
};
const handleAmpRotate = () => {
  if (! parameters.amp_rotate) return;
  const period = amp_rotate.keys.length;
  amp_rotate.progress = (amp_rotate.progress + .003) % period;
  const three_pillars = [-period, 0, +period].map((x) => (
    x + amp_rotate.progress
  ));
  amp_rotate.keys.forEach((pitch, i) => {
    const distance = min(three_pillars.map((pillar) => (abs(pillar - i))));
    piano.setActivation(pitch, max(0, 1.3 - distance) * 100, true);
  });
};
