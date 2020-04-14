import { GlUtilities, gl } from "./gl/gl";
import { Matrix4x4 } from "./math/matrix4x4";
import { MessageBus } from "./message/messageBus";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "./assets/assetManager";
import { BasicShader } from "./gl/shaders/basicShader";
import { MaterialManager } from "./graphics/materialManager";
import { Material } from "./graphics/material";
import { Color } from "./graphics/colors";
import { ZoneManager } from "./world/zoneManager";
import { InputManager, MouseContext } from "./input/inputManager";
import { Message } from "./message/message";
import { IMessageHandler } from "./message/IMessageHandler";
import { AudioManager } from "./audio/audioManager";
import { CollisionManager } from "./collision/collisionManager";
import { BitmapFontManager } from "./graphics/bitmapFontManager";
import { Vector2 } from "./math/vector2";

export class Engine implements IMessageHandler {
  private _canvas: HTMLCanvasElement;
  private _basicShader: BasicShader;
  private _projection: Matrix4x4;
  private _previousTime = 0;

  private _gameWidth: number;
  private _gameHeight: number;

  private _isFirstUpdate: boolean = true;
  private _aspect: number;
  
  constructor(width?: number, height?: number) {
    this._gameWidth = width;
    this._gameHeight = height;
  }

  public start(): void {
    this._canvas = GlUtilities.initialize();

    if (this._gameWidth && this._gameHeight) {
      this._aspect = this._gameWidth / this._gameHeight;
    }

    ZoneManager.initialize();
    AssetManager.initialize();
    InputManager.initialize(this._canvas);

    Message.subscribe('MOUSE_UP', this);

    gl.clearColor(146/255, 206/255, 247/255, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this._basicShader = new BasicShader();
    this._basicShader.use();

    BitmapFontManager.addFont('default', 'fonts/text.txt');
    BitmapFontManager.load();

    MaterialManager.registerMaterial(new Material('bg', 'textures/bg.png', Color.white()));
    MaterialManager.registerMaterial(new Material('end', 'textures/end.png', Color.white()));
    MaterialManager.registerMaterial(new Material('middle', 'textures/middle.png', Color.white()));

    MaterialManager.registerMaterial(new Material('grass', 'textures/grass.png', Color.white()));
    MaterialManager.registerMaterial(new Material('duck', 'textures/duck.png', Color.white()));
    
    MaterialManager.registerMaterial(new Material('playbtn', 'textures/playbtn.png', Color.white()));
    MaterialManager.registerMaterial(new Material('restartbtn', 'textures/restartbtn.png', Color.white()));
    MaterialManager.registerMaterial(new Material('score', 'textures/score.png', Color.white()));
    MaterialManager.registerMaterial(new Material('title', 'textures/title.png', Color.white()));
    MaterialManager.registerMaterial(new Material('tutorial', 'textures/tutorial.png', Color.white()));
    
    AudioManager.loadSoundFile('flap', 'sounds/flap.mp3', false);
    AudioManager.loadSoundFile('ting', 'sounds/ting.mp3', false);
    AudioManager.loadSoundFile('dead', 'sounds/dead.mp3', false);
    
    this._projection = Matrix4x4.orthographic(
      0, this._canvas.width, this._canvas.height, 0, -100.0, 100
    );

    this.resize();
    
    this.preloading();
  }

  public resize() {
    if (this._canvas) {
      if (this._gameWidth === undefined || this._gameHeight === undefined) {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this._projection = Matrix4x4.orthographic(
          0, window.innerWidth, window.innerHeight, 0, -100.0, 100
        );
      } else {
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;
        const newWidthToHeight = newWidth/newHeight;
        const gameArea = document.getElementById('gameArea');

        if (newWidthToHeight > this._aspect) {
          newWidth = newHeight * this._aspect;
          gameArea.style.height = newHeight + 'px';
          gameArea.style.width = newWidth + 'px';
        } else {
          newHeight = newWidth / this._aspect;
          gameArea.style.height = newHeight + 'px';
          gameArea.style.width = newWidth + 'px';
        }

        gameArea.style.marginTop = (-newHeight / 2) + 'px';
        gameArea.style.marginLeft = (-newWidth / 2) + 'px';

        this._canvas.width = newWidth;
        this._canvas.height = newHeight;

        gl.viewport(0, 0, newWidth, newHeight);
        this._projection = Matrix4x4.orthographic(
          0, this._gameWidth, this._gameHeight, 0, -100.0, 100
        );

        const resolutionScale = new Vector2(newWidth / this._gameWidth, newHeight / this._gameHeight);
        InputManager.setResolutionScale(resolutionScale)
      }
    }
  }

  onMessage(message: Message): void {
    if (message.code === "MOUSE_UP") {
      const context = message.context as MouseContext;
    }
  }

  private loop(): void {
    if (this._isFirstUpdate) {

    }
    this.update();
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  private preloading(): void {
    MessageBus.update(0);

    if (!BitmapFontManager.updateReady()) {
      requestAnimationFrame(this.preloading.bind(this));
      return;
    }

    ZoneManager.changeZone(0);

    this.loop();
  }

  private update(): void {
    const delta = performance.now() - this._previousTime;
    MessageBus.update(delta);
    ZoneManager.update(delta);
    CollisionManager.update(delta);
    this._previousTime = performance.now();
  }

  private render(): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    ZoneManager.render(this._basicShader);

    const projectionPosition = this._basicShader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
  }
}