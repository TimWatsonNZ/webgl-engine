
(Math as any).clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

(Math as any).degToRad = (degrees: number): number => {
  return degrees * Math.PI/180;
}

(Math as any).radToDeg = (rad: number): number => {
  return rad * 180/Math.PI;
}

import { Engine } from "./core/engine";
import './index.css'

let engine: Engine;
window.onload = () => {
  engine = new Engine(320, 480);
  engine.start();
}

window.onresize = () => {
  if (engine) {
    engine.resize();
  }
} 