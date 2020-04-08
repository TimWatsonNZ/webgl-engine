import { Zone } from "./zone";
import { Shader } from "../gl/shaders/shader";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { JsonAsset } from "../assets/jsonAssetLoader";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";

export class ZoneManager implements IMessageHandler{

  private static _globalZoneId: number = -1;
  // private static _zones: { [id: number]: Zone } = {};
  
  private static _registeredZones: { [id: number]: string } = {};
  private static _activeZone: Zone;

  private static _inst: ZoneManager;

  private constructor() {
  }
  
  public static initialize(): void {
    ZoneManager._inst = new ZoneManager();
    ZoneManager._registeredZones[0] = 'zones/testZone.json';
  }

  public static changeZone(id: number): void {
    if (ZoneManager._activeZone !== undefined) {
      ZoneManager._activeZone.onDeactivated();
      ZoneManager._activeZone.unload();
      ZoneManager._activeZone = undefined;
    }

    const zoneName = ZoneManager._registeredZones[id];
    if (zoneName) {


      if (AssetManager.isAssetLoaded(zoneName)) {
        const asset = AssetManager.getAsset(zoneName);

        ZoneManager.loadZone(asset);
      } else {
        Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + ZoneManager._registeredZones[id], ZoneManager._inst);
        AssetManager.loadAsset(ZoneManager._registeredZones[id]);
      }

    } else {
      throw new Error(`Zone id: ${id} does not exist.`);
    }
  }

  public static update(time: number): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.update(time);
    }
  }

  public static render(shader: Shader): void {
    if (ZoneManager._activeZone) {
      ZoneManager._activeZone.render(shader);
    }
  }

  public onMessage(message: Message): void {
    if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) > -1) {
      const asset = message.context as JsonAsset;
      ZoneManager.loadZone(asset);
    }
  }

  private static loadZone(asset: JsonAsset): void {
    const zoneData = asset.data;

    if (zoneData.id === undefined) {
      throw new Error(`Id missing in zone json: ${zoneData}`);
    }

    if (zoneData.name === undefined) {
      throw new Error(`Name missing in zone json: ${zoneData}`);
    }

    const zoneId = Number(zoneData.id);
    const zoneName = String(zoneData.name);
    const zoneDescription = String(zoneData.description);

    console.log(`Zone changed to ${zoneName}`);
    ZoneManager._activeZone = new Zone(zoneId, zoneName, zoneDescription);
    ZoneManager._activeZone.initialize(zoneData);
    ZoneManager._activeZone.onActivated();
    ZoneManager._activeZone.load();
  }

}