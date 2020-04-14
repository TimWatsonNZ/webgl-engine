import { BaseBehaviour } from "./BaseBehaviour";
import { IBehaviourData } from "./IBehaviourData";

import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { InputManager, Keys, MouseContext } from "../input/inputManager";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";

export class MouseClickBehaviourData implements IBehaviourData {
  public name: string;
  public width: number;
  public height: number;
  public messageCode: string;

  public setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error(`Name must be defined in behaviourData.`);
    }

    this.name = String(json.name);

    if (json.width !== undefined) {
      this.width = Number(json.width);
    } else {
      throw new Error('Width must be defined in behaviourData.');
    
    }
    if (json.height !== undefined) {
      this.height = Number(json.height);
    } else {
      throw new Error('height must be defined in behaviourData.');
    }

    if (json.messageCode !== undefined) {
      this.messageCode = json.messageCode;
    } else {
      throw new Error('messageCode must be defined in behaviourData.');
    }

  }
}

export class MouseClickBehaviourBuilder implements IBehaviourBuilder {
  public get type(): string {
    return 'mouseClick';
  };

  buildFromJson(json: any): MouseClickBehaviour {
    const data = new MouseClickBehaviourData();
    data.setFromJson(json);
    return new MouseClickBehaviour(data);
  }
}

export class MouseClickBehaviour extends BaseBehaviour implements IMessageHandler {

  private _width: number;
  private _height: number;
  private _messageCode: string;

  public constructor(data: MouseClickBehaviourData) {
    super(data);

    this._width = data.width;
    this._height = data.height;
    this._messageCode = data.messageCode;
    Message.subscribe("MOUSE_UP", this);
  }

  public onMessage(message: Message): void {
    if (message.code === "MOUSE_UP") {
      if (!this._owner.isVisible) {
        return;
      }

      const context = message.context as MouseContext;
      const worldPos = this._owner.getWorldPosition();
      const extentX = worldPos.x + this._width;
      const extentY = worldPos.y + this._height;

      if (context.position.x >= worldPos.x && context.position.x < extentX &&
        context.position.y >= worldPos.y && context.position.y <= extentY) {
        Message.send(this._messageCode, this);
      }
    }
  }

  public update(time: number): void {

    super.update(time);
  }
}