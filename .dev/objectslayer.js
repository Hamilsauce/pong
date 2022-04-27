const LEFT_MOUSE_BUTTON = 0;

class SvgObject {
  constructor(mouseController, svgElement) {
    this.mouseController = mouseController;
    this.events = [];

    // These two parameters are actually the shape TRANSLATION, not the absolute coordinates!!!
    this.X = 0;
    this.Y = 0;

    // These two parameters are the relative 
    // change during the CURRENT translation.
    
    // These are reset to 0 at the beginning of each move.
    // We use these numbers for translating the anchors because anchors are always 
    // placed with an initial translation of (0, 0)
    this.dragX = 0;
    this.dragY = 0;

    this.mouseController.attach(svgElement, this);
  }

  // Register the event so that when we destroy the object, we can unwire the event listeners.
  registerEvent(element, eventName, callbackRef) {
    this.events.push({ element: element, eventName: eventName, callbackRef: callbackRef });
  }

  destroy() {
    this.unhookEvents();
  }

  registerEventListener(element, eventName, callback, self) {
    var ref;

    if (self == null) {
      self = this;
    }

    element.addEventListener(eventName, ref = callback.bind(self));
    this.registerEvent(element, eventName, ref);
  }

  unhookEvents() {
    for (var i = 0; i < this.events.length; i++) {
      var event = this.events[i];
      event.element.removeEventListener(event.eventName, event.callbackRef);
    }

    this.events = [];
  }

  startMove() {
    this.dragX = 0;
    this.dragY = 0;
  }

  updatePosition(evt) {
    var mouseX = evt.clientX;
    var mouseY = evt.clientY;
    var mouseDX = mouseX - this.mouseController.mouseDownX;
    var mouseDY = mouseY - this.mouseController.mouseDownY;
    this.X += mouseDX;
    this.Y += mouseDY;
    this.mouseController.mouseDownX = mouseX;
    this.mouseController.mouseDownY = mouseY;
  }

  onMouseLeave(evt) {}
}




class MouseController {
  constructor() {
    this.mouseDown = false;
    this.controllers = {};
    this.activeController = null;
  }

  // Create a map between then SVG element (by it's ID, so ID's must be unique) and its controller.
  attach(svgElement, controller) {
    var id = svgElement.getAttribute("id");
    this.controllers[id] = controller;
  }

  detach(svgElement) {
    var id = svgElement.getAttribute("id");
    delete this.controllers[id];
  }

  // Get the controller associated with the event and remember where the user clicked.
  onMouseDown(evt) {
    if (evt.button == LEFT_MOUSE_BUTTON) {
      evt.preventDefault();
      var id = evt.currentTarget.getAttribute("id");
      this.activeController = this.controllers[id];
      this.mouseDown = true;
      this.mouseDownX = evt.clientX;
      this.mouseDownY = evt.clientY;
    }
  }

  // If the user is dragging, call the controller's onDrag function.
  onMouseMove(evt) {
    evt.preventDefault();

    if (this.mouseDown && this.activeController != null) {
      this.activeController.onDrag(evt);
    }
  }

  // Any dragging is now done.
  onMouseUp(evt) {
    if (evt.button == LEFT_MOUSE_BUTTON) {
      evt.preventDefault();
      this.clearSelectedObject();
    }
  }

  // Any dragging is now done.
  onMouseLeave(evt) {
    evt.preventDefault();
    if (this.mouseDown && this.activeController != null) {
      this.activeController.onMouseLeave();
    }
  }

  clearSelectedObject() {
    this.mouseDown = false;
    this.activeController = null;
  }
}
