import { Engine } from "./core/engine";
import './index.css'

let engine: Engine;
window.onload = () => {
  engine = new Engine();
  engine.start();
}

window.onresize = () => {
  if (engine) {
    engine.resize();
  }
} 