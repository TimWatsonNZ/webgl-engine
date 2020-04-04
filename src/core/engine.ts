import { GlUtilities, gl } from "./gl/gl";
import { Shader } from "./gl/shader";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/messageBus";
import { AssetManager } from "./assets/assetManager";

export class Engine {
  private _canvas: HTMLCanvasElement;
  private _shader: Shader;
  private _projection: Matrix4x4;

  private _sprite: Sprite;
  
  constructor() {

  }

  public start(): void {
    this._canvas = GlUtilities.initialize();

    gl.clearColor(0, 0, 0, 1);

    this.loadShaders();
    this._shader.use();
    AssetManager.initialize();

    this._projection = Matrix4x4.orthographic(
      0, this._canvas.width, 0, this._canvas.height, -100.0, 100
    );

    this._sprite = new Sprite('test', 'crate.png', 100, 100);
    this._sprite.load();
    this._sprite.position.x = 200;

    this.resize();
    this.loop();
  }

  public resize() {
    if (this._canvas) {
      this._canvas.width = window.innerWidth;
      this._canvas.height = window.innerHeight;

      gl.viewport(-1, 1, -1, 1);
    }
  }

  private loop(): void {
    MessageBus.update(0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const colorPosition = this._shader.getUniformLocation('u_tint');
    // gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
    gl.uniform4f(colorPosition, 1, 1, 1, 1);


    const projectionPosition = this._shader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

    const modelLocation = this._shader.getUniformLocation('u_model');
    gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));
    this._sprite.draw(this._shader);

    requestAnimationFrame(this.loop.bind(this));
  }

  private loadShaders(): void {
    const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec2 a_texCoord;

    uniform mat4 u_projection;
    uniform mat4 u_model;

    varying vec2 v_texCoord;

    void main() {
      gl_Position = u_projection * u_model * vec4(a_position, 1.0);
      v_texCoord = a_texCoord;
    }
    `;

    let fragmentShaderSource = `
      precision mediump float;

      uniform vec4 u_tint;
      uniform sampler2D u_diffuse;

      varying vec2 v_texCoord;

      void main() {
        gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
      }
    `;

    this._shader = new Shader('basic', vertexShaderSource, fragmentShaderSource);
  }
}