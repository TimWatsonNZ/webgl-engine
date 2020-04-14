import { IBehaviourData } from "./IBehaviourData";
import { Vector2 } from "../math/vector2";
import { BaseBehaviour } from "./BaseBehaviour";
import { IMessageHandler } from "../message/IMessageHandler";
import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { Message } from "../message/message";
import { throws } from "assert";

export class ScrollBehaviourData implements IBehaviourData{
  public name: string;
  public velocity: Vector2 = Vector2.zero;
  public minPosition: Vector2 = Vector2.zero;
  public resetPosition: Vector2 = Vector2.zero;

  public startMessage: string;
  public stopMessage: string;
  public resetMessage: string;

  public minResetY: number;
  public maxResetY: number;
  
  public setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error(`Name must be defined in scroll behaviour data.`);
    }

    this.name = String(json.name);

    if (json.resetMessage !== undefined) {
      this.resetMessage = String(json.resetMessage);
    }

    if (json.stopMessage !== undefined) {
      this.stopMessage = String(json.stopMessage);
    }

    if (json.startMessage !== undefined) {
      this.startMessage = String(json.startMessage);
    }

    if (json.velocity !== undefined) {
      this.velocity.setFromJson(json.velocity);
    } else {
      throw new Error(`ScrollBehaviourData requires property 'velocity' to be defined.`)
    }

    if (json.minPosition !== undefined) {
      this.minPosition.setFromJson(json.minPosition);
    } else {
      throw new Error(`ScrollBehaviourData requires property 'minPosition' to be defined.`)
    }

    if (json.resetPosition !== undefined) {
      this.resetPosition.setFromJson(json.resetPosition);
    } else {
      throw new Error(`ScrollBehaviourData requires property 'resetPosition' to be defined.`)
    }

    if (json.minResetY !== undefined) {
      this.minResetY = json.minResetY;
    }

    if (json.maxResetY !== undefined) {
      this.maxResetY = json.maxResetY;
    }
  }
}

export class ScrollBehaviourBuilder implements IBehaviourBuilder {
  public get type(): string {
    return 'scroll';
  };

  buildFromJson(json: any): ScrollBehaviour {
    const data = new ScrollBehaviourData();
    data.setFromJson(json);
    return new ScrollBehaviour(data);
  }
}

export class ScrollBehaviour extends BaseBehaviour implements IMessageHandler {
  private _velocity: Vector2 = Vector2.zero;
  private _minPosition: Vector2 = Vector2.zero;
  private _resetPosition: Vector2 = Vector2.zero;

  private _minResetY: number;
  private _maxResetY: number;

  private _startMessage: string;
  private _stopMessage: string;
  private _resetMessage: string;

  private _isScrolling: boolean = false;
  private _initialPosition: Vector2 = Vector2.zero;

  public constructor(data: ScrollBehaviourData) {
    super(data);

    this._velocity.copyFrom(data.velocity);
    this._minPosition.copyFrom(data.minPosition);
    this._resetPosition.copyFrom(data.resetPosition);

    this._startMessage = data.startMessage;
    this._stopMessage = data.stopMessage;
    this._resetMessage = data.resetMessage;

    if (data.minResetY !== undefined) {
      this._minResetY = data.minResetY;
    }
    
    if (data.maxResetY !== undefined) {
      this._maxResetY = data.maxResetY;
    }
  }

  public updateReady(): void {
    super.updateReady();

    if (this._startMessage !== undefined) {
      Message.subscribe(this._startMessage, this);
    }

    if (this._stopMessage !== undefined) {
      Message.subscribe(this._stopMessage, this);
    }

    if (this._resetMessage !== undefined) {
      Message.subscribe(this._resetMessage, this);
    }

    this._initialPosition.copyFrom(this._owner.transform.position.toVector2());
  }

  public update(time: number): void {
    if (this._isScrolling) {
      this._owner.transform.position.add(this._velocity.clone().scale(time/1000).toVector3());
    }

    const scrollY = this._minResetY !== undefined && this._maxResetY !== undefined;

    if (this._owner.transform.position.x <= this._minPosition.x &&
        this._owner.transform.position.y <= this._minPosition.y &&
        (scrollY || (!scrollY && this._owner.transform.position.y <= this._minPosition.y))) {
      this.reset();
    }
  }

  onMessage(message: Message): void {
    if (message.code === this._startMessage) {
      this._isScrolling = true;
    }

    if (message.code === this._stopMessage) {
      this._isScrolling = false;
    }

    if (message.code === this._resetMessage) {
      this.initial();
    }
  }

  private reset(): void {
    if (this._minResetY !== undefined && this._maxResetY !== undefined) {
      this._owner.transform.position.set(this._resetPosition.x, this.getRandomY());
    } else {
      this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
    }
    
  }

  private initial(): void {
    this._owner.transform.position.copyFrom(this._initialPosition.toVector3());
  }

  private getRandomY(): number {
    return Math.floor( Math.random() * -10);
  }
  
}