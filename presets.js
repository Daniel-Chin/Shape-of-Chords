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
  document.getElementById('triad-menu').style.display = f(
    category === 'triad'
  );
  document.getElementById('tetrad-menu').style.display = f(
    category === 'tetrad'
  );
  const neg_or_inv = ['note', 'interval'].includes(category);
  document.getElementById('negative-menu').style.display = f(
    category && neg_or_inv
  );
  document.getElementById('inversion-menu').style.display = f(
    category && ! neg_or_inv
  );
  document.getElementById('4-inv').style.display = 
    category === 'tetrad' ? 'inline-block' : 'none';
  if (category) {
    usePreset(neg_or_inv);
  }
};

const usePreset = (neg_or_inv) => {
  const chord = getSelected(category);
  if (chord === null) return;
  let negative; let inversion;
  if (neg_or_inv) {
    negative = parseInt(getSelected('negative'));
    if (isNaN(negative)) return;
  } else {
    inversion = parseInt(getSelected('inversion'));
    if (isNaN(inversion)) return;
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
    case 'triad':
      const triad = {
        maj: [4, 7], 
        min: [3, 7], 
        aug: [4, 8], 
        dim: [3, 6], 
      }[chord];
      while (inversion > 1) {
        inversion --;
        triad.unshift(triad.pop() - 12);
      }
      piano.setActivation(60, 100);
      triad.forEach((offset) => {
        piano.setActivation(60 + offset, 100);
        amp_rotate.keys.push(60 + offset);
      });
      break;
    case 'tetrad':
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
