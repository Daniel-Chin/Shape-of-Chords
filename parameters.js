const parameters = {
  trace_speed: .2097,
  stroke_decay: .005,
  justin: true,
  amp_rotate: false,
  trace_multi: 4,
};

const getParaUI = (para_name) => (
  JSON.parse(getSelected(para_name))
);

const onParaChange = () => {
  parameters.justin = getParaUI('justin');
  parameters.trace_speed = getParaUI('trace');
  parameters.stroke_decay = getParaUI('decay');
  parameters.amp_rotate = getParaUI('rotate');
  onMenuChange();
};
