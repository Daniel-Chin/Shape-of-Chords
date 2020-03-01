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
  const category = getSelected('category');
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
    usePreset(category, neg_or_inv);
  }
};

const usePreset = (category, neg_or_inv) => {
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
  switch (category) {
    case 'note':
      piano.setActivation(60 + parseInt(chord) * negative, 1);
      break;
    case 'interval':
      piano.setActivation(60, 1);
      piano.setActivation(60 + parseInt(chord) * negative, 1);
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
      piano.setActivation(60, 1);
      triad.forEach((offset) => {
        piano.setActivation(60 + offset, 1);
      });
      break;
    case 'tetrad':
      break;
  }
};
