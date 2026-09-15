import assert from "node:assert/strict";
import * as THREE from "three";
import { movementAxes, tourLookAfterDrag, tourStep, yawAfterDrag } from "../src/motion/curationControls.js";

const yaw = 0.47;
const camera = new THREE.PerspectiveCamera();
camera.rotation.order = "YXZ";
camera.rotation.y = yaw;
camera.updateMatrixWorld(true);

const actualCameraForward = new THREE.Vector3(0, 0, -1)
  .applyQuaternion(camera.quaternion)
  .setY(0)
  .normalize();
const axes = movementAxes(yaw);
const wMovement = new THREE.Vector3(axes.forwardX, 0, axes.forwardZ).normalize();

assert.ok(
  actualCameraForward.dot(wMovement) > 0.9999,
  `W must follow the camera. camera=${actualCameraForward.toArray()} movement=${wMovement.toArray()}`,
);

const yawAfterDraggingRight = yawAfterDrag(0, 100);
const cameraAfterRightDrag = new THREE.PerspectiveCamera();
cameraAfterRightDrag.rotation.y = yawAfterDraggingRight;
cameraAfterRightDrag.updateMatrixWorld(true);
const forwardAfterRightDrag = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraAfterRightDrag.quaternion);

assert.ok(
  forwardAfterRightDrag.x > 0,
  `Dragging right must turn the camera right. forward=${forwardAfterRightDrag.toArray()}`,
);

assert.ok(Math.abs(axes.forwardX * axes.rightX + axes.forwardZ * axes.rightZ) < 1e-10, "movement axes must stay orthogonal");
assert.ok(Math.abs(Math.hypot(axes.forwardX, axes.forwardZ) - 1) < 1e-10, "forward axis must stay normalized");

const draggedRight = tourLookAfterDrag(0, 0, 120, 0, 1200, 800);
assert.ok(draggedRight.lookX > 0, "dragging right must pan the tour camera right");
const keyboardRight = tourStep({ lookX: 0, lookY: 0, dolly: 1 }, 0, 1, 1);
assert.ok(keyboardRight.lookX > 0, "D must pan the tour camera right");
const keyboardForward = tourStep({ lookX: 0, lookY: 0, dolly: 1 }, 1, 0, 1);
assert.ok(keyboardForward.dolly > 1, "W must move the tour camera forward");

console.log("curation controls: direction checks passed");
