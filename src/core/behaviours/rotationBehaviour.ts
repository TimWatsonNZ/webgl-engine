import { BaseBehaviour } from "./BaseBehaviour";
import { IBehaviourData } from "./IBehaviourData";
import { Vector3 } from "../math/vector3";
import { IBehaviourBuilder } from "./IBehaviourBuilder";

export class RotationBehaviourData implements IBehaviourData {
  public name: string;

  public rotation: Vector3 = Vector3.zero;

  public setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error(`Name must be defined in behaviourData.`);
    }

    this.name = String(json.name);

    if (json.rotation !== undefined) {
      this.rotation.setFromJson(json.rotation);
    }
  }
}

export class RotationBehaviourBuilder implements IBehaviourBuilder {
  public get type(): string {
    return 'rotation';
  };

  buildFromJson(json: any): RotationBehaviour {
    const data = new RotationBehaviourData();
    data.setFromJson(json);
    return new RotationBehaviour(data);
  }

}

export class RotationBehaviour extends BaseBehaviour {
  name: string;

  private _rotation: Vector3;

  public constructor(data: RotationBehaviourData) {
    super(data);

    this._rotation = data.rotation;
  }

  public update(time: number): void {
    this._owner.transform.rotation.add(this._rotation);

    super.update(time);
  }
}