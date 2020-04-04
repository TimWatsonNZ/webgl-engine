import { Texture } from "./texture";

class TextureReferenceNode {
  public texture: Texture;
  public referenceCount: number = 1;

  public constructor(texture: Texture) {
    this.texture = texture;
  }
}

export class TextureManager {
  private static _textures: { [key: string]: TextureReferenceNode } = {};
  
  private constructor() {

  }

  public static getTexture(textureName: string): Texture {
    if (TextureManager._textures[textureName] === undefined) {
      const texture = new Texture(textureName);
      TextureManager._textures[textureName] = new TextureReferenceNode(texture);
    } else {
      TextureManager._textures[textureName].referenceCount++;
    }

    return TextureManager._textures[textureName].texture;
  }

  public static releaseTexture(textureName: string): void {
    if (TextureManager._textures[textureName] === undefined) {
      console.warn(`A texture named: ${textureName} does not exist.`);
    } else {
      TextureManager._textures[textureName].referenceCount--;
      if (TextureManager._textures[textureName].referenceCount < 1) {
        TextureManager._textures[textureName].texture.destroy();
        delete TextureManager._textures[textureName];
      }
    }
  }
}