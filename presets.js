const getSelected = (menu_name) => {
  const radio = document.querySelector(`input[name="${menu_name}"]:checked`);
  if (radio) {
    return radio.value
  } else {
    return null;
  }
};

const onMenuClick = () => {
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
  usePreset();
};

const usePreset = () => {

};
