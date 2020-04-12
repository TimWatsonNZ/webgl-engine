import { Vector3 } from "./vector3";

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

  public static get zero(): Vector2 {
    return new Vector2();
  }

  public static get one(): Vector2 {
    return new Vector2(1,1);
  }

  public set(x?: number, y?: number): void {
    if (x !== undefined) {
      this._x = x;
    }
    if (y !== undefined) {
      this._y = y;
    }
  }

  public copyFrom(v: Vector2): void {
    this.x = v.x;
    this.y = v.y;
  }

  public static distance(a: Vector2, b: Vector2): number {
    const diff = a.clone().subtract(b);

    return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  }

  public toArray(): number[] {
    return [this._x, this._y];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloat32Array());
  }

  public toVector3(): Vector3 {
    return new Vector3(this._x, this._y, 0);
  }

  public setFromJson(json: any): void {
    if (json.x !== undefined) {
      this.x = Number(json.x);
    }
    if (json.y !== undefined) {
      this.y = Number(json.y);
    }
  }
  
  public add(v: Vector2): Vector2 {
    this._x += v._x;
    this._y += v._y;
    
    return this;
  }

  public subtract(v: Vector2): Vector2 {
    this._x -= v._x;
    this._y -= v._y;
    
    return this;
  }

  public multiply (v: Vector2): Vector2 {
    this._x *= v._x;
    this._y *= v._y;
    
    return this;
  }

  public divide(v: Vector2): Vector2 {
    this._x /= v._x;
    this._y /= v._y;
    
    return this;
  }

  public scale(scale: number): Vector2 {
    this._x *= scale;
    this._y *= scale;

    return this;
  }

  public clone(): Vector2 {
    return  new Vector2(this._x, this._y);
  }
}