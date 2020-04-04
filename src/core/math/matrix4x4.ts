import { Vector3 } from "./vector3";

export class Matrix4x4 {
  private _data: number[] = [];

  private constructor() {
    this._data = [
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]
  }

  public get data(): number[] {
    return this._data;
  }

  public static identity(): Matrix4x4 {
    return new Matrix4x4();
  }

  public static orthographic(
    left: number, right: number, bottom: number, top: number,
    nearClip: number, farClip: number): Matrix4x4 {
      const m = new Matrix4x4();

      const lr: number = 1.0/(left-right);
      const bt = 1.0/(bottom-top);
      const nf = 1.0/(nearClip - farClip);

      m._data[0] = -2.0 * lr;
      m._data[5] = -2.0 * bt;
      m._data[10] = 2.0 * nf;

      m._data[12] = (left + right)*lr;
      m.data[13] = (top + bottom)*bt;
      m._data[14] = (farClip + nearClip) * nf;


      return m;
  }
    
  public static translation(position: Vector3): Matrix4x4 {
    const m = new Matrix4x4();

    m._data[12] = position.x;
    m._data[13] = position.y;
    m._data[14] = position.z;

    return m;
  }
}