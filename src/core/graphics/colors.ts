export class Color {
  private _r: number;
  private _g: number;
  private _b: number;
  private _a: number;

  constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
  }

  public get r(): number {
    return this._r;
  }

  public get rFloat(): number {
    return this._r/255;
  }

  public set r(v: number) {
    this.r = v;
  }

  public get g(): number {
    return this._g;
  }

  public get gFloat(): number {
    return this._g/255;
  }

  public set g(v: number) {
    this.g = v;
  }

  public get b(): number {
    return this._b;
  }

  public get bFloat(): number {
    return this._b/255;
  }

  public set b(v: number) {
    this.b = v;
  }

  public get a(): number {
    return this._a;
  }

  public get aFloat(): number {
    return this._a/255;
  }

  public set a(v: number) {
    this.a = v;
  }

  public toArray(): number[] {
    return [this._r, this._g, this._b, this._a];
  }

  public toFloatArray(): number[] {
    return [this._r/255, this._g/255, this._b/255, this._a/255];
  }

  public toFloat32Array(): Float32Array {
    return new Float32Array(this.toFloatArray());
  }

  public static white(): Color {
    return new Color();
  }

  public static black(): Color {
    return new Color(0,0,0,255);
  }
  
  public static red(): Color {
    return new Color(255,0,0,255);
  }
  
  public static green(): Color {
    return new Color(0,255,0,255);
  }
  
  public static blue(): Color {
    return new Color(0,0,255,255);
  }
}
