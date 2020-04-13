import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { TextAsset } from "../assets/textAssetLoader";
import { Vector2 } from "../math/vector2";

class FontUtilities {
  public static extractFieldValue(field: string): string {
    return field.split('=')[1];
  }
}

export class FontGlyph {
  public id: number;
  public x: number;
  public y: number;

  public width: number;
  public height: number;
  public xOffset: number;
  public yOffset: number;
  public xAdvance: number;
  public page: number;
  public channel: number;

  private constructor() {

  }

  public static fromFields(fields: string[]): FontGlyph {
    const glyph = new FontGlyph();

    glyph.id = Number(FontUtilities.extractFieldValue(fields[1]));
    glyph.x =  Number(FontUtilities.extractFieldValue(fields[2]));
    glyph.y =  Number(FontUtilities.extractFieldValue(fields[3]));

    glyph.width =  Number(FontUtilities.extractFieldValue(fields[4]));
    glyph.height =  Number(FontUtilities.extractFieldValue(fields[5]));
    glyph.xOffset =  Number(FontUtilities.extractFieldValue(fields[6]));
    glyph.yOffset =  Number(FontUtilities.extractFieldValue(fields[7]));
    glyph.xAdvance =  Number(FontUtilities.extractFieldValue(fields[8]));
    glyph.page =  Number(FontUtilities.extractFieldValue(fields[9]));
    glyph.channel =  Number(FontUtilities.extractFieldValue(fields[10]));

    return glyph;
  }
}

export class BitmapFont implements IMessageHandler {
  
  private _name: string;
  private _fontFileName: string;
  private _assetLoaded: boolean = false;
  private _imageFile: string;
  private _glyphs: { [id: number]: FontGlyph } = {};
  private _size: number;
  private _imageWidth: number;
  private _imageHeight: number;
  
  public constructor(name: string, fontFile: string) {
    this._name = name;
    this._fontFileName = fontFile;
  }

  public get name(): string {
    return this._name;
  }

  public get size(): number {
    return this._size;
  }

  public get imageWidth(): number {
    return this._imageWidth;
  }

  public get imageHeight(): number {
    return this._imageHeight;
  }

  public get textureName(): string {
    return this._imageFile;
  }

  public get isLoaded(): boolean {
    return this._assetLoaded;
  }

  public load(): void {
    const asset = AssetManager.getAsset(this._fontFileName);

    if (asset !== undefined) {
      this.processFontFile(asset.data);
    } else {
      Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._fontFileName, this);
    }
  }
  
  onMessage(message: Message): void {
    if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._fontFileName) {
      this.processFontFile((message.context as TextAsset).data);
    }
  }
  
  public getGlyph(char: String): FontGlyph {
    let code = char.charCodeAt(0);
    
    code = this._glyphs[code] === undefined ? 63 : code;

    return this._glyphs[code];
  }

  public measureText(text: string): Vector2 {
    const size = Vector2.zero;

    let maxX = 0;
    let x = 0;
    let y = 0;

    for (let c of text) {
      switch(c) {
        case '\n': {
          maxX = x > maxX ? x : maxX;
          x = 0;
          y += this._size;
          break;
        }
        default: 
          x += this.getGlyph(c).xAdvance;
          break;
      }
    }

    size.set(x, y);
    return size;
  }

  private processFontFile(content: string): void {
    let charCount = 0;
    const lines = content.split('\n');

    for (let line of lines) {
      const data = line.replace(/\s\s+/g, ' ');
      const fields = data.split(' ');

      switch(fields[0]) {
        case "info":
          this._size = Number(FontUtilities.extractFieldValue(fields[2]));
          break;
        case "common":
          this._imageWidth = Number(FontUtilities.extractFieldValue(fields[3]));
          this._imageHeight = Number(FontUtilities.extractFieldValue(fields[4]));
          break;
        case "page": {

          const id = Number(FontUtilities.extractFieldValue(fields[1]));

          this._imageFile = FontUtilities.extractFieldValue(fields[2]).replace(/["]+/g, '');
          
          this._imageFile = ('fonts/' + this._imageFile).trim();
          break;
        }
        case "chars": {
          charCount = Number(FontUtilities.extractFieldValue(fields[1]));
          charCount++;
          break;
        }
        case "char": {
          const glyph = FontGlyph.fromFields(fields);
          this._glyphs[glyph.id] = glyph;
          break;
        }
      }
    }
    
    let actualGlpyhCount = 0;

    const keys = Object.keys(this._glyphs);
    for (let key of keys) {
      if (this._glyphs.hasOwnProperty(key)) {
        actualGlpyhCount++;
      }
    }

    if (actualGlpyhCount !== charCount) {
      throw new Error(`Font file report existence of ${charCount} glpys but only ${actualGlpyhCount} were loaded.`);
    }
    this._assetLoaded = true;
  }
}