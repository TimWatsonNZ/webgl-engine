import { gl } from "../gl";

export abstract class Shader {
  _name: string;
  _program: WebGLProgram;
  private _attributes: { [key: string]: number } = {};
  private _uniforms: { [key: string]: WebGLUniformLocation } = {};

  constructor(name: string) {
    this._name = name;
  }

  public get name(): string {
    return this._name;
  }

  public getAttributeLocation(name: string): number {
    if (this._attributes[name] === undefined) {
      throw new Error(`Unable to find attribute name: ${name} in shader: ${this._name}`);
    }

    return this._attributes[name];
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    if (this._uniforms[name] === undefined) {
      throw new Error(`Unable to find uniform name: ${name} in shader: ${this._name}`);
    }

    return this._uniforms[name];
  }

  public use(): void {
    gl.useProgram(this._program);
  }

  protected load(vertexSource: string, fragmentSource: string): void {
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
  
    this.createProgram(vertexShader, fragmentShader);

    this.detectAttributes();
    this.detectUniforms();
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    let shader: WebGLShader = gl.createShader(shaderType);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const error = gl.getShaderInfoLog(shader);

    if (error !== "") {
      throw new Error(`Error compiling shader ${this._name}: ${error}`);
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
    this._program = gl.createProgram();

    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);

    gl.linkProgram(this._program);

    const error = gl.getProgramInfoLog(this._program);
    
    if (error !== "") {
      throw new Error(`Error linking shader ${this._name}: ${error}`);
    }
  }

  private detectAttributes(): void {
    const attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
  
    for (let i = 0;i < attributeCount;i++) {
      const attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);

      if (!attributeInfo) {
        break;
      }

      this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
    }
  }

  private detectUniforms(): void {
    const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
  
    for (let i = 0;i < uniformCount;i++) {
      const info: WebGLActiveInfo = gl.getActiveUniform(this._program, i);

      if (!info) {
        break;
      }

      this._uniforms[info.name] = gl.getUniformLocation(this._program, info.name);
    }
  }
}