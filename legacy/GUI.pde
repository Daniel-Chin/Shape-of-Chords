import java.util.Stack;

Director director = new Director();

class Layer extends ArrayList<Layer> {
  // so that you can group components. 
  private boolean visibility;
  public Layer parent;
  public PVector position;
  public PVector _size;
  public String title = null;

  public Layer() {
    super();
    visibility = true;
    position = new PVector(0f, 0f);
    _size = new PVector(1f, 1f);
  }
  void add(int index, Layer child) {
    super.add(index, child);
    child.parent = this;
  }
  boolean add(Layer child) {
    child.parent = this;
    return super.add(child);
  }
  public PVector getPosition() {
    return position;
  }
  public PVector getSize() {
    return _size;
  }
  public boolean isVisible() {
    return visibility;
  }
  void show() {
    visibility = true;
  }
  void hide() {
    visibility = false;
  }
  void toggleVisibility() {
    visibility = ! visibility;
  }
  void draw() {
    for (Layer child : this) {
      if (child.isVisible()) {
        child.draw();
      }
    }
  }
  void onEnter() { }
  void onLeave() { }
}

class Pressable extends Layer {
  void hide() {
    super.hide();
    if (director.dragging == this) {
      onRelease();
      director.dragging = null;
    }
  }
  boolean beingDragged() {
    return director.dragging == this;
  }
  boolean isMouseOver() {
    return false;   // to override
  }
  void onPress() {
  }
  void onDrag(float delta_x, float delta_y) {
  }
  void onRelease() {
  }
  void onClick() {
  }
}

void mousePressed() {
  handleMousePress(director.root);
}

void handleMousePress(Layer layer) {  // recursively broadcast event
  for (Layer child : layer) {
    if (child.isVisible()) {
      if (child instanceof Pressable) {
        if (((Pressable) child).isMouseOver()) {
          ((Pressable) child).onPress();
          director.dragging = (Pressable) child;
          director.lastDrag = new PVector(mouseX, mouseY);
          break;
        }
      } else {
        handleMousePress(child);
      }
    }
  }
}

void mouseDragged() {
  if (director.dragging != null) {
    director.dragging.onDrag(
      mouseX - director.lastDrag.x, 
      mouseY - director.lastDrag.y);
    director.lastDrag = new PVector(mouseX, mouseY);
  }
}

void mouseReleased() {
  if (director.dragging != null) {
    director.dragging.onRelease();
    if (director.dragging.isMouseOver()) {
      director.dragging.onClick();
    }
    director.dragging = null;
  }
}

class KeyboardListener extends Layer {
  void focus() {
    director.focusing = this;
  }
  void unfocus() {
    director.focusing = null;
  }
  boolean hasFocus() {
    return director.focusing == this;
  }
  void hide() {
    super.hide();
    if (director.focusing == this) {
      director.focusing = null;
    }
  }
  void onKeypress(int key_code) {}
}

void keyPressed() {
  if (director.focusing != null) {
    director.focusing.onKeypress(keyCode);
  }
}

class Director {
  class SceneTransitionManager {
    float speed = .15f;
    Stack<Button> stackButton = new Stack<Button>();
    Stack<Layer> stackScene = new Stack<Layer>();
    float progress;
    float push_or_pop = 0f;
    void push(Button button, Layer scene) {
      stackButton.push(button);
      stackScene.push(scene);
      progress = 1f;
      push_or_pop = - speed;
    }
    Layer pop() {
      progress = 0f;
      push_or_pop = speed;
      return stackScene.pop();
    }
    boolean render() {
      if (push_or_pop == 0f) return false;
      progress += push_or_pop;
      if (progress >= 1f || progress < 0f) {
        done();
        return false;
      }
      float t = (1f - cos(progress * PI)) / 2f;
      Button button = stackButton.peek();
      PVector position = button.position;
      PVector _size = button._size;
      strokeWeight(3);
      noFill();
      rect(
        t * position.x, 
        t * position.y, 
        t * _size.x + (1f - t) * width, 
        t * _size.y + (1f - t) * height
      );
      return true;
    }
    void done() {
      if (push_or_pop == speed) {
        stackButton.pop();
      }
      push_or_pop = 0f;
    }
  }
  Layer root;
  SceneTransitionManager transitionManager = new SceneTransitionManager();
  Pressable dragging = null;
  PVector lastDrag;
  KeyboardListener focusing = null;
  void render() {
    if (transitionManager.render()) return;
    root.draw();
  }
  void enterScene(Layer scene) {
    if (root == scene) return;
    if (root != null) {
      root.onLeave();
    }
    root = scene;
    surface.setTitle(scene.title);
    scene.onEnter();
  }
  void push(Button button, Layer scene) {
    transitionManager.push(button, root);
    enterScene(scene);
  }
  void pop() {
    enterScene(transitionManager.pop());
  }
}

class Button extends Pressable {
  String _text; 
  int fontsize;
  color back;
  color fore;
  color colorBorder;
  color highlight;
  int press_sink_depth;
  int corner_smooth;
  private boolean floating;
  private float float_progress;

  public Button(String _text, float x, float y, float _width, float _height) {
    this._text = _text;
    this.position = new PVector(x, y);
    this._size = new PVector(_width, _height);
    fontsize = 30;
    back = #000000;
    fore = #FFFFFF;
    colorBorder = fore;
    highlight = #005555;
    press_sink_depth = 5;
    corner_smooth = 12;
    floating = false;
  }

  public Button() {
    this("", 0f, 0f, 100f, 100f);
  }

  void draw() {
    if (isMouseOver()) {
      fill(highlight);
    } else {
      fill(back);
    }
    pushMatrix();
    if (beingDragged()) {
      translate(0, press_sink_depth);
      floating = true;
      float_progress = press_sink_depth;
    } else {
      if (floating) {
        float_progress *= .8;
        if (float_progress < 1) {
          floating = false;
        } else {
          translate(0, float_progress);
        }
      }
    }
    stroke(colorBorder);
    strokeWeight(2);
    rect(getPosition().x, getPosition().y, getSize().x, getSize().y, corner_smooth);
    textSize(fontsize);
    fill(fore);
    textAlign(CENTER, CENTER);
    text(_text, getPosition().x, getPosition().y - fontsize/8, getSize().x, getSize().y);
    popMatrix();
  }

  boolean isMouseOver() {
    return getPosition().x < mouseX && mouseX < getPosition().x+getSize().x 
      && getPosition().y < mouseY && mouseY < getPosition().y+getSize().y;
  }
}

class Card extends Button {
  Card(String _text, float x, float y, float _width, float _height) {
    super(_text, x, y, _width, _height);
    colorBorder = #555555;
    corner_smooth = 0;
  }
  Card() {
    this("", 0f, 0f, 100f, 100f);
  }
  boolean isMouseOver() {
    return false;
  }
}

class Slider extends KeyboardListener {
  boolean on_change_when_dragging = false;
  class Arrow extends Button {
    public Arrow(String _text) {
      this._text = _text;
      fontsize = 36;
    }
    PVector getPosition() {
      float x;
      if (_text == "<") {
        x = parent.getPosition().x;
      } else {
        x = parent.getPosition().x + parent.getSize().x - parent.getSize().y;
      }
      return new PVector(x, parent.getPosition().y);
    }
    PVector getSize() {
      return new PVector(parent.getSize().y, parent.getSize().y);
    }
    void onClick() {
      ((Slider) parent).arrowClick(_text);
    }
  }
  class Box extends Button {
    color colorFocused;
    float hint_fontsize_ratio;

    public Box() {
      _size.x = 100;
      fontsize = 30;
      fore = #FFFFFF;
      back = #000000;
      highlight = #005555;
      colorFocused = #0000cc;
      hint_fontsize_ratio = .6;
    }
    PVector getPosition() {
      return new PVector(((Slider) parent).boxX(), parent.getPosition().y);
    }
    PVector getSize() {
      return new PVector(_size.x, parent.getSize().y);
    }
    void onPress() {
      if (((Slider) parent).hasFocus()) return;
      clicked_or_dragged = true;
    }
    void onDrag(float delta_x, float delta_y) {
      if (hasFocus()) return;
      clicked_or_dragged = false;
      value += delta_x / ((Slider) parent).slideSpace() * (_max - _min);
      legalizeValue();
      if (on_change_when_dragging) {
        onChange();
      }
    }
    void onRelease() {
      if (hasFocus()) return;
      value = int(value);
      legalizeValue();
      onChange();
    }
    void onClick() {
      if (hasFocus()) return;
      if (clicked_or_dragged) {
        focus();
        input_value = "";
      }
    }
    void draw() {
      strokeWeight(2);
      if (((Slider) parent).hasFocus()) {
        fill(colorFocused);
        stroke(fore);
      } else if (beingDragged()) {
        fill(fore);
        stroke(back);
      } else if (isMouseOver()) {
        fill(highlight);
        stroke(fore);
      } else {
        fill(back);
        stroke(fore);
      }
      rect(getPosition().x, getPosition().y, getSize().x, getSize().y, corner_smooth);
      fill(g.strokeColor);
      textSize(fontsize);
      textAlign(CENTER, CENTER);
      String to_draw;
      if (((Slider) parent).hasFocus()) {
        if (input_value.length() == 0) {
          to_draw = "Type!";
          textSize(fontsize * hint_fontsize_ratio);
        } else {
          to_draw = input_value;
        }
      } else {
        to_draw = value2Text(((Slider) parent).getValue());
      }
      text(to_draw, getPosition().x, getPosition().y - fontsize/8, getSize().x, getSize().y);
    }
  }
  class Rail extends Layer {
    color stroke_color;
    int thick;
    Rail() {
      stroke_color = #FFFFFF;
      thick = 2;
    }
    void draw() {
      stroke(stroke_color);
      strokeWeight(thick);
      line(parent.getPosition().x + parent.getSize().y, parent.getPosition().y + parent.getSize().y/2, 
        parent.getPosition().x + parent.getSize().x - parent.getSize().y, parent.getPosition().y + parent.getSize().y/2);
    }
  }
  int _min, _max;
  float value;
  Arrow leftArrow, rightArrow;
  Box box;
  Rail rail;
  private boolean clicked_or_dragged;
  private String input_value;

  public Slider(float x, float y, float _width, float _height) {
    this.position = new PVector(x, y);
    this._size = new PVector(_width, _height);
    _min = 0; 
    _max = 100;
    value = _max;
    leftArrow = new Arrow("<");
    rightArrow = new Arrow(">");
    box = new Box();
    rail = new Rail();
    this.add(rail);
    this.add(box);
    this.add(leftArrow);
    this.add(rightArrow);
  }

  void setValue(int new_value) {
    value = new_value;
    legalizeValue();
    onChange();
  }

  private void arrowClick(String left_or_right) {
    if (hasFocus()) return;
    if (left_or_right == "<") {
      value --;
    } else {
      // >
      value ++;
    }
    legalizeValue();
    onChange();
  }

  private void legalizeValue() {
    if (value < _min) value = _min;
    if (value > _max) value = _max;
  }

  private float slideSpace() {
    return getSize().x - 2*getSize().y - box.getSize().x;
  }

  int getValue() {
    return int(value);
  }

  void onKeypress(int key_code) {
    if (key_code == 10) {
      // Enter
      unfocus();
      if (input_value.length() != 0) {
        value = Integer.parseInt(input_value);
        legalizeValue();
        onChange();
      }
    } else if (48 <= key_code && key_code < 58
      || 96 <= key_code && key_code < 106) {
      // Number
      input_value += key;
    } else if (key_code == 8) {
      // Backspace
      if (input_value.length() > 0) {
        input_value = input_value.
          substring(0, input_value.length() - 1);
      }
    }
  }

  void onChange() {
    ; // event. To override.
  }

  private float boxX() {
    float proportion = ((float)(value - _min)) 
      / (_max - _min);
    return int(slideSpace() * proportion) + getPosition().x + getSize().y;
  }

  String value2Text(int value) {
    return String.valueOf(value);
  }
}
