import { GlUtilities, gl } from "./gl/gl";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/messageBus";
import { AssetManager } from "./assets/assetManager";
import { BasicShader } from "./gl/shaders/basicShader";
import { MaterialManager } from "./graphics/materialManager";
import { Material } from "./graphics/material";
import { Color } from "./graphics/colors";
import { ZoneManager } from "./world/zoneManager";

export class Engine {
  private _canvas: HTMLCanvasElement;
  private _basicShader: BasicShader;
  private _projection: Matrix4x4;
  private _previousTime = 0;
  
  constructor() {

  }

  public start(): void {
    this._canvas = GlUtilities.initialize();
    AssetManager.initialize();
    ZoneManager.initialize();

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this._basicShader = new BasicShader();
    this._basicShader.use();

    MaterialManager.registerMaterial(new Material('crate', 'textures/crate.png', Color.white()));
    MaterialManager.registerMaterial(new Material('duck', 'textures/duck.png', Color.white()));
    this._projection = Matrix4x4.orthographic(
      0, this._canvas.width, this._canvas.height, 0, -100.0, 100
    );

    ZoneManager.changeZone(0);

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
    this.update();
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  private update(): void {
    const delta = performance.now() - this._previousTime;
    MessageBus.update(delta);
    ZoneManager.update(delta);
    this._previousTime = performance.now();
  }

  private render(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    ZoneManager.render(this._basicShader);

    const projectionPosition = this._basicShader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
    
  }
}