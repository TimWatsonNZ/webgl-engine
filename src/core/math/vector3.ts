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
  
  public copyFrom(vector: Vector3): void {
    this._x = vector.x; 
    this._y = vector.y;
    this._z = vector.z;
  }

  public toArray(): number[] {
    return [this._x, this._y, this._z];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloat32Array());
  }
}