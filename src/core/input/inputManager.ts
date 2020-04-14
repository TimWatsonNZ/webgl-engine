import { Vector2 } from "../math/vector2";
import { Message } from "../message/message";

export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
}

export class MouseContext {
  public leftDown: boolean;
  public rightDown: boolean;
  public position: Vector2;

  public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
    this.leftDown = leftDown;
    this.rightDown = rightDown;
    this.position = position;
  }
}

export class InputManager {

  private static _keys: boolean[] = [];

  private static _mouseX: number;
  private static _mouseY: number;
  private static _previousMouseX: number;
  private static _previousMouseY: number;

  private static _leftDown: boolean;
  private static _rightDown: boolean;
  private static _resolutionScale: Vector2 = Vector2.one

  public static initialize(viewPort: HTMLCanvasElement): void {
    for (let i = 0; i< 255;i++) {
      InputManager._keys[i] = false;
    }

    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('keyup', InputManager.onKeyUp);

    viewPort.addEventListener('mousemove', InputManager.onMouseMove);
    viewPort.addEventListener('mousedown', InputManager.onMouseDown);
    viewPort.addEventListener('mouseup', InputManager.onMouseUp);
  }

  public static isKeyDown(key: Keys): boolean {
    return InputManager._keys[key];
  }

  private static onKeyDown(event: KeyboardEvent): boolean {
    InputManager._keys[event.keyCode] = true;
    event.preventDefault();
    event.stopPropagation();

    return false;
  }

  private static onKeyUp(event: KeyboardEvent): boolean {
    InputManager._keys[event.keyCode] = false;
    event.preventDefault();
    event.stopPropagation();
    
    return false;
  }

  public static getMousePosistion(): Vector2 {
    return new Vector2(this._mouseX, this._mouseY);
  }

  private static onMouseMove(event: MouseEvent): void {
    InputManager._previousMouseX = InputManager._mouseX;
    InputManager._previousMouseY = InputManager._mouseY;

    InputManager._mouseX = event.clientX;
    InputManager._mouseY = event.clientY;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    InputManager._mouseX = (event.clientX - Math.round(rect.left)) * (1 / InputManager._resolutionScale.x);
    InputManager._mouseY = (event.clientY - Math.round(rect.top)) * (1 / InputManager._resolutionScale.y);
  }

  private static onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      this._leftDown = true;
    } else if (event.button === 2) {
      this._rightDown = true;
    }

    Message.send('MOUSE_DOWN', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosistion()));
  }
  
  private static onMouseUp(event: MouseEvent): void {
    if (event.button === 0) {
      this._leftDown = false;
    } else if (event.button === 2) {
      this._rightDown = false;
    }

    Message.send('MOUSE_UP', this, new MouseContext(InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosistion()));
  }

  public static setResolutionScale(scale: Vector2): void {
    InputManager._resolutionScale.copyFrom(scale);
  }
}