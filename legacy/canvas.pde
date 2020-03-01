Canvas canvas = new Canvas();

class Canvas extends Layer {
  static final TIMESTEP = .1;

  float u;
  PVector last;

  Canvas() {
    super();
    start();
  }

  void draw() {
    u += TIMESTEP;
    if (hasEnded()) return;

    float v;
    int total_activation;
    for (int pitch = 0; pitch < 128; pitch ++) {
      int activation = piano.activation[pitch];
      total_activation += activation;
      if (activation > 0) {
        v += sin(
          u 
          * piano.pitchToFreq(pitch) 
          / piano.pitchToFreq(60)
        ) * activation;
      }
    }
    v /= total_activation;

    v *= _size.y * .4;
    pushMatrix();
    translate(position);
    translate(_size.x / 2, _size.y / 2);
    PVector now = new PVector(v * cos(u), - v * sin(u));
    if (last != null) {
      // stroke(getShade());
      stroke(0);
      line(last.x, last.y, now.x, now.y);
      fill(rgba(0, 0, 0, parameters.stroke_decay));
    }
    popMatrix();
    last = now;
  }

  void clear() {
    noStroke();
    rect(position.x, position.y, _size.x, _size.y);
  }

  void start() {
    fill(255);
    clear();
    u = 0;
    last = null;
  }

  int getShade() {
    return 255 * (1f - u * parameters.stroke_decay);
  }

  boolean hasEnded() {
    // return getShade() < 0;
    return false;
  }
}
