const buildPiano = (from, to) => {
  from = from | (60 - 24);
  to = to | (60 + 24);
  const keyboard = document.getElementById('keyboard');
  if (from % 12 !== 0) {
    console.error('Can only build a piano starting from a C.');
    keyboard.innerHTML = 'ERROR. check console';
    return;
  }
  let pitch = from;
  let i = 0;
  while (pitch <= to) {
    const key = document.createElement('div');
    key.classList.add(i % 2 ? 'black-key' : 'white-key');
    if ([5, 13].includes(i % 14)) {
      key.style.visibility = 'hidden';
    } else {
      key.id = `key-${pitch}`;
      key.onclick = onKeyboardClick.bind(null, pitch);
      pitch ++;
    }
    keyboard.appendChild(key);
    i ++; 
  }
};

const onKeyboardClick = (pitch) => {
  if (piano.activation[pitch]) {
    piano.setActivation(pitch, 0);
    amp_rotate.keys = amp_rotate.keys.filter((x) => (x != pitch));
  } else {
    piano.setActivation(pitch, 100);
    if (! amp_rotate.keys.includes(pitch)) {
      amp_rotate.keys.push(pitch);
    }
  }
};
