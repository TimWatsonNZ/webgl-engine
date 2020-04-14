import { IBehaviourData } from "./IBehaviourData";
import { IBehaviour } from "./IBehaviour";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { BaseBehaviour } from "./BaseBehaviour";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { throws } from "assert";

export class VisibilityOnMessageBehaviourData implements IBehaviourData{
  public name: string;
  public messageCode: string;
  public visible: boolean;

  public setFromJson(json: any): void {
    const behaviourName = 'VisibilityOnMessageBehaviour';
    if (json.messageCode === undefined) {
      throw new Error(`${behaviourName} requires 'messageCode' to be defined`);
    } else {
      this.messageCode = String(json.messageCode);
    }

    if (json.visible === undefined) {
      throw new Error(`${behaviourName} requires 'visible' to be defined`);
    } else {
      this.visible = Boolean(json.visible);
    }
  }
}

export class VisibilityOnMessageBehaviourBuilder implements IBehaviourBuilder {
  public get type(): string {
    return "visibilityOnMessage";
  }

  public buildFromJson(json: any): IBehaviour {
    const data = new VisibilityOnMessageBehaviourData();
    data.setFromJson(json);
    return new VisibilityOnMessageBehaviour(data);
  }
}

export class VisibilityOnMessageBehaviour extends BaseBehaviour implements IMessageHandler {
  private _messageCode: string;
  private _visible: boolean;

  public constructor(data: VisibilityOnMessageBehaviourData) {
    super(data);

    this._messageCode = data.messageCode;
    this._visible = data.visible;

    Message.subscribe(this._messageCode, this);
  }

  public onMessage(message: Message): void {
    if (message.code === this._messageCode) {
      this._owner.isVisible = this._visible;
    }
  }
}