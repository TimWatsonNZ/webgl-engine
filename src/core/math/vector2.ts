export class Vector2 {
  private _x: number;
  private _y: number;

  public constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }

  public set x(n: number) {
    this._x = n;
  }

  public get y(): number {
    return this._y;
  }

  public set y(n: number) {
    this._y = n;
  }

  public toArray(): number[] {
    return [this._x, this._y];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloat32Array());
  }
}