import { BaseBehaviour } from "./BaseBehaviour";
import { IBehaviourData } from "./IBehaviourData";

import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { InputManager, Keys } from "../input/inputManager";

export class KeyboardMovementBehaviourData implements IBehaviourData {
  public name: string;
  public speed: number = 0.1;

  public setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error(`Name must be defined in behaviourData.`);
    }

    this.name = String(json.name);

    if (json.speed !== undefined) {
      this.speed = json.speed;
    }

  }
}

export class KeyboardMovementBehaviourBuilder implements IBehaviourBuilder {
  public get type(): string {
    return 'keyboardMovement';
  };

  buildFromJson(json: any): KeyboardMovementBehaviour {
    const data = new KeyboardMovementBehaviourData();
    data.setFromJson(json);
    return new KeyboardMovementBehaviour(data);
  }
}

export class KeyboardMovementBehaviour extends BaseBehaviour {
  public name: string;
  public speed: number = 0.1;

  public constructor(data: KeyboardMovementBehaviourData) {
    super(data);
    this.speed = data.speed;
  }

  public update(time: number): void {
    if (InputManager.isKeyDown(Keys.LEFT)) {
      this._owner.transform.position.x -= this.speed;
    }
    if (InputManager.isKeyDown(Keys.RIGHT)) {
      this._owner.transform.position.x += this.speed;
    }
    if (InputManager.isKeyDown(Keys.UP)) {
      this._owner.transform.position.y -= this.speed;
    }
    if (InputManager.isKeyDown(Keys.DOWN)) {
      this._owner.transform.position.y += this.speed;
    }

    super.update(time);
  }
}