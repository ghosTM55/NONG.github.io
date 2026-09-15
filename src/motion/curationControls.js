export function movementAxes(yaw) {
  return {
    forwardX: -Math.sin(yaw),
    forwardZ: -Math.cos(yaw),
    rightX: Math.cos(yaw),
    rightZ: -Math.sin(yaw),
  };
}

export function yawAfterDrag(yaw, deltaX, sensitivity = 0.0037) {
  return yaw - deltaX * sensitivity;
}

export function tourLookAfterDrag(lookX, lookY, deltaX, deltaY, width, height) {
  return {
    lookX: Math.max(-1, Math.min(1, lookX + (deltaX / Math.max(width, 1)) * 2.4)),
    lookY: Math.max(-1, Math.min(1, lookY + (deltaY / Math.max(height, 1)) * 2.1)),
  };
}

export function tourStep(view, forward, side, deltaSeconds) {
  return {
    lookX: Math.max(-1, Math.min(1, view.lookX + side * deltaSeconds * 0.78)),
    lookY: view.lookY,
    dolly: Math.max(1, Math.min(1.42, view.dolly + forward * deltaSeconds * 0.34)),
  };
}
