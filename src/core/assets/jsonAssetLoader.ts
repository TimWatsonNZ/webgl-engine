import { IAssetLoader } from "./IAssetLoader";
import { IAsset } from "./IAsset";
import { AssetManager } from "./assetManager";

export class JsonAsset implements IAsset {
  public readonly name: string;
  public readonly data: any;

  public constructor(name: string, data: any) {
    this.name = name;
    this.data = data;
  }
}

export class JsonAssetLoader implements IAssetLoader {
  public get supportedExtensions(): string[] {
    return ['json'];
  }

  loadAsset(assetName: string): void {
    const request: XMLHttpRequest = new XMLHttpRequest();
    request.open('GET', assetName);

    request.addEventListener('load', () => {
      this.onJsonLoaded(assetName, request);
    });

    request.send();
  }

  private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
    console.log(`onJSONLoaded assetName/request`, assetName, request);

    if (request.readyState === request.DONE) {
      const json = JSON.parse(request.responseText);
      const asset = new JsonAsset(assetName, json);
      AssetManager.onAssetLoaded(asset);
    }
  }
}