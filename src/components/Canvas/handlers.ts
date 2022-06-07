import {
  TLBounds,
  TLKeyboardEventHandler,
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLWheelEventHandler,
} from "@tldraw/core";

import { machine } from "~/src/state/machine";

export const onHoverShape: TLPointerEventHandler = (info, e) => {
  machine.send("HOVERED_SHAPE", info);
};

export const onUnhoverShape: TLPointerEventHandler = (info, e) => {
  machine.send("UNHOVERED_SHAPE", info);
};

export const onPointShape: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_SHAPE", info);
};

export const onPointCanvas: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_CANVAS", info);
};

export const onPointBounds: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_BOUNDS", info);
};

export const onPointHandle: TLPointerEventHandler = (info, e) => {
  machine.send("POINTED_HANDLE", info);
};

export const onPointerDown: TLPointerEventHandler = (info, e) => {
  machine.send("STARTED_POINTING", info);
};

export const onPointerUp: TLPointerEventHandler = (info, e) => {
  machine.send("STOPPED_POINTING", info);
};

export const onPointerMove: TLPointerEventHandler = (info, e) => {
  machine.send("MOVED_POINTER", info);
};

export const onPan: TLWheelEventHandler = (info, e) => {
  machine.send("PANNED", info);
};

export const onPinchStart: TLPinchEventHandler = (info, e) => {
  machine.send("STARTED_PINCHING", info);
};

export const onPinch: TLPinchEventHandler = (info, e) => {
  machine.send("PINCHED", info);
};

export const onPinchEnd: TLPinchEventHandler = (info, e) => {
  machine.send("STOPPED_PINCHING", info);
};

export const onPointBoundsHandle: TLPinchEventHandler = (info, e) => {
  machine.send("POINTED_BOUNDS_HANDLE", info);
};

export const onBoundsChange = (bounds: TLBounds) => {
  machine.send("RESIZED", { bounds });
};

export const onKeyDown: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "Alt":
    case "Meta":
    case "Control":
    case "Shift": {
      machine.send("TOGGLED_MODIFIER", info);
      break;
    }
    case "Backspace": {
      machine.send("DELETED", info);
      break;
    }
    case "Escape": {
      machine.send("CANCELLED", info);
      break;
    }
    case "0": {
      machine.send("ZOOMED_TO_ACTUAL", info);
      break;
    }
    case "1": {
      machine.send("ZOOMED_TO_FIT", info);
      break;
    }
    case "2": {
      machine.send("ZOOMED_TO_SELECTION", info);
      break;
    }
    case "=": {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault();
        machine.send("ZOOMED_IN", info);
      }
      break;
    }
    case "-": {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault();
        machine.send("ZOOMED_OUT", info);
      }
      break;
    }
    case "s":
    case "v": {
      machine.send("SELECTED_TOOL", { name: "select" });
      break;
    }
    case "r":
    case "b": {
      machine.send("SELECTED_TOOL", { name: "box" });
      break;
    }
    case "d": {
      machine.send("SELECTED_TOOL", { name: "pencil" });
      break;
    }
    case "e": {
      machine.send("SELECTED_TOOL", { name: "eraser" });
      break;
    }
    case "a": {
      if (info.metaKey || info.ctrlKey) {
        machine.send("SELECTED_ALL");
        e.preventDefault();
      } else {
        machine.send("SELECTED_TOOL", { name: "arrow" });
      }
      break;
    }
    case "z": {
      if (info.metaKey || info.ctrlKey) {
        if (info.shiftKey) {
          machine.send("REDO");
        } else {
          machine.send("UNDO");
        }
      }
      break;
    }
  }
};

export const onKeyUp: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "Alt":
    case "Meta":
    case "Control":
    case "Shift": {
      machine.send("TOGGLED_MODIFIER", info);
      break;
    }
  }
};
