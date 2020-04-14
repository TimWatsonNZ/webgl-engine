import { IComponentData } from "./IComponentData";
import { Vector3 } from "../math/vector3";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./baseComponent";
import { BitmapText } from "../graphics/bitmapText";
import { Shader } from "../gl/shaders/shader";
import { Message } from "../message/message";
import { IMessageHandler } from "../message/IMessageHandler";

export class BitmapTextComponentData implements IComponentData{
  public name: string;
  public fontName: string;
  public origin = Vector3.zero;
  public text: string;

  public setFromJson(json: any): void {
    if (json.name !== undefined) {
      this.name = String(json.name);
    }

    if (json.fontName !== undefined) {
      this.fontName = String(json.fontName);
    }

    if (json.origin !== undefined) {
      this.origin.setFromJson(json.origin);
    }

    if (json.text !== undefined) {
      this.text = String(json.text);
    }
  }
}

export class BitmapTextComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return 'bitmapText';
  }

  public buildFromJson(json: any): IComponent {
    const data = new BitmapTextComponentData();
    data.setFromJson(json);
    
    return new BitmapTextComponent(data);
  }
}

export class BitmapTextComponent extends BaseComponent implements IMessageHandler {
  private _bitmapText: BitmapText;
  private _fontName: string;

  public constructor(data: BitmapTextComponentData) {
    super(data);

    this._fontName = data.fontName;
    this._bitmapText = new BitmapText(this.name, this._fontName);

    if (!data.origin.equals(Vector3.zero)) {
      this._bitmapText.origin.copyFrom(data.origin);
    }
    this._bitmapText.text = data.text;

    Message.subscribe(`${this.name}:SetText`, this);
  }

  public load(): void {
    this._bitmapText.load();
  }

  public update(time: number): void {
    this._bitmapText.update(time);
  }

  public render(shader: Shader): void {
    this._bitmapText.draw(shader, this.owner.worldMatrix);
    super.render(shader)
  }
  
  onMessage(message: Message): void {
    if (message.code === `${this.name}:SetText`) {
      this._bitmapText.text = String(message.context);
    }
  }
}