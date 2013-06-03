/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */
function PointerEvent(inType, inDict) {
  var props = {
    bubbles: false,
    cancelable: false,
    view: null,
    detail: null,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    buttons: undefined,
    which: 0,
    relatedTarget: null,
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tiltX: 0,
    tiltY: 0,
    pointerType: '',
    hwTimestamp: 0,
    isPrimary: false
  };

  // import values from the given dictionary
  for (var p in inDict) {
    if (p in props) {
      props[p] = inDict[p];
    }
  }

  // According to the w3c spec,
  // http://www.w3.org/TR/DOM-Level-3-Events/#events-MouseEvent-button
  // MouseEvent.button == 0 can mean either no mouse button depressed, or the
  // left mouse button depressed.
  //
  // As of now, the only way to distinguish between the two states of
  // MouseEvent.button is by using the deprecated MouseEvent.which property, as
  // this maps mouse buttons to positive integers > 0, and uses 0 to mean that
  // no mouse button is held.
  //
  // MouseEvent.which is derived from MouseEvent.button at MouseEvent creation,
  // but initMouseEvent does not expose an argument with which to set
  // MouseEvent.which. Calling initMouseEvent with a buttonArg of 0 will set
  // MouseEvent.button == 0 and MouseEvent.which == 1, breaking the expectations
  // of app developers.
  //
  // The only way to propagate the correct state of MouseEvent.which and
  // MouseEvent.button to a new MouseEvent.button == 0 and MouseEvent.which == 0
  // is to call initMouseEvent with a buttonArg value of -1.
  //
  // This is fixed with DOM Level 4's use of buttons
  var b = props.which ? props.button : -1;

  // Spec requires that pointers without pressure specified use 0.5 for down
  // state and 0 for up state.
  var pressure;
  if (props.pressure) {
    pressure = props.pressure;
  } else if (props.buttons !== undefined) {
    pressure = props.buttons ? 0.5 : 0;
  } else {
    pressure = b > -1 ? 0.5 : 0;
  }

  var e;
  if (document.implementation.hasFeature('MouseEvent', '4.0')) {
    e = new MouseEvent(inType, inDict);
  } else {
    e = document.createEvent('MouseEvent');
    // define the properties inherited from MouseEvent
    e.initMouseEvent(
      inType, props.bubbles, props.cancelable, props.view, props.detail,
      props.screenX, props.screenY, props.clientX, props.clientY, props.ctrlKey,
      props.altKey, props.shiftKey, props.metaKey, b, props.relatedTarget
    );
  }
  // define the properties of the PointerEvent interface
  Object.defineProperties(e, {
    pointerId: { value: props.pointerId, enumerable: true },
    width: { value: props.width, enumerable: true },
    height: { value: props.height, enumerable: true },
    pressure: { value: pressure, enumerable: true },
    tiltX: { value: props.tiltX, enumerable: true },
    tiltY: { value: props.tiltY, enumerable: true },
    pointerType: { value: props.pointerType, enumerable: true },
    hwTimestamp: { value: props.hwTimestamp, enumerable: true },
    isPrimary: { value: props.isPrimary, enumerable: true },
  });
  return e;
};
