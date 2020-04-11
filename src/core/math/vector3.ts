import { Vector2 } from "./vector2";

export class Vector3 {
  private _x: number;
  private _y: number;
  private _z: number;

  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
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

  public get z(): number {
    return this._z;
  }

  public set z(n: number) {
    this._z = n;
  }

  public static get zero(): Vector3 {
    return new Vector3();
  }

  public static get one(): Vector3 {
    return new Vector3(1,1,1);
  }

  public set(x?: number, y?: number, z?: number): void {
    if (x !== undefined) {
      this._x = x;
    }
    if (y !== undefined) {
      this._y = y;
    }
    if (z !== undefined) {
      this._z = z;
    }
  }

  public toArray(): number[] {
    return [this._x, this._y, this._z];
  }

  public equals(v: Vector3): boolean {
    return (
      this.x === v.x && 
      this.y === v.y &&
      this.z === v.z
    );
  }

  public static distance(a: Vector3, b: Vector3): number {
    const diff = a.subtract(b);

    return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z*diff.z);
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloat32Array());
  }
  
  public copyFrom(vector: Vector3): void {
    this._x = vector.x; 
    this._y = vector.y;
    this._z = vector.z;
  }

  public setFromJson(json: any): void {
    if (json.x !== undefined) {
      this.x = Number(json.x);
    }
    if (json.y !== undefined) {
      this.y = Number(json.y);
    }
    if (json.z !== undefined) {
      this.z = Number(json.z);
    }
  }

  public add(v: Vector3): Vector3 {
    this._x += v._x;
    this._y += v._y;
    this._z += v._z;
    
    return this;
  }

  public subtract(v: Vector3): Vector3 {
    this._x -= v._x;
    this._y -= v._y;
    this._z -= v._z;
    
    return this;
  }

  public multiply (v: Vector3): Vector3 {
    this._x *= v._x;
    this._y *= v._y;
    this._z *= v._z;
    
    return this;
  }

  public divide(v: Vector3): Vector3 {
    this._x /= v._x;
    this._y /= v._y;
    this._z /= v._z;
    
    return this;
  }

  public clone(): Vector3 {
    return new Vector3(this._x, this._y, this._z);
  }

  public toVector2(): Vector2 {
    return new Vector2(this._x, this._y);
  }
}