const canvas = {
  draw: () => {
    canvas.u += parameters.trace_speed;
    // if (hasEnded()) return;

    let { v, total_amp } = piano.amp.reduce((acc, amp, pitch) => {
      if (amp > 0) {
        acc.total_amp += amp;
        acc.v += sin(
          canvas.u 
          * piano.pitchToFreq(pitch) 
          / piano.pitchToFreq(60)
        ) * amp;
      }
      return acc;
    }, { v: 0, total_amp: 0 });
    v /= total_amp;

    v *= width * .4;
    push();
    translate(width / 2, height / 2);
    const now = { x: v * cos(canvas.u), y: - v * sin(canvas.u) };
    if (canvas.last !== null) {
      stroke(0);
      line(canvas.last.x, canvas.last.y, now.x, now.y);
      canvas.clear_tick += parameters.stroke_decay;
      while (canvas.clear_tick > .05) {
        canvas.clear_tick -= .1;
        background('rgba(255, 255, 255, .1)');
      }
    }
    pop();
    canvas.last = now;
  },

  start: () => {
    fill(255);
    background(255);
    canvas.u = 0;
    canvas.last = null;
    canvas.clear_tick = 0;
  }, 
}
