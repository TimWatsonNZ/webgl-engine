import { GlUtilities, gl } from "./gl/gl";
import { Sprite } from "./graphics/sprite";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/messageBus";
import { AssetManager } from "./assets/assetManager";
import { BasicShader } from "./gl/shaders/basicShader";
import { MaterialManager } from "./graphics/materialManager";
import { Material } from "./graphics/material";
import { Color } from "./graphics/colors";

export class Engine {
  private _canvas: HTMLCanvasElement;
  private _basicShader: BasicShader;
  private _projection: Matrix4x4;

  private _sprite: Sprite;
  
  constructor() {

  }

  public start(): void {
    this._canvas = GlUtilities.initialize();
    AssetManager.initialize();

    gl.clearColor(0, 0, 0, 1);

    this._basicShader = new BasicShader();
    this._basicShader.use();

    MaterialManager.registerMaterial(new Material('crate', './textures/crate.png', new Color(0,128,255,255)));

    this._projection = Matrix4x4.orthographic(
      0, this._canvas.width, this._canvas.height, 0, -100.0, 100
    );

    this._sprite = new Sprite('test', 'crate', 100, 100);
    this._sprite.load();
    this._sprite.position.x = 200;
    this._sprite.position.y = 10;

    this.resize();
    this.loop();
  }

  public resize() {
    if (this._canvas) {
      this._canvas.width = window.innerWidth;
      this._canvas.height = window.innerHeight;

      this._projection = Matrix4x4.orthographic(
        0, this._canvas.width, this._canvas.height, 0, -100.0, 100
      );
      gl.viewport(-1, 1, this._canvas.width, this._canvas.height);
    }
  }

  private loop(): void {
    MessageBus.update(0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const projectionPosition = this._basicShader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
    
    this._sprite.draw(this._basicShader);

    requestAnimationFrame(this.loop.bind(this));
  }
}