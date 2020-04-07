import { IBehaviourBuilder } from "./IBehaviourBuilder";
import { IBehaviour } from "./IBehaviour";
import { RotationBehaviourBuilder } from "./rotationBehaviour";

export class BehaviourManager {
  private static _registeredBuilders: { [key: string]: IBehaviourBuilder } = {};

  public static registerBuilder(builder: IBehaviourBuilder): void {
    BehaviourManager._registeredBuilders[builder.type] = builder;
  }

  public static extractBehaviour(json: any): IBehaviour {
    if (json.type !== undefined) {

      if (BehaviourManager._registeredBuilders[json.type] !== undefined) {
        return BehaviourManager._registeredBuilders[String(json.type)].buildFromJson(json);
      }
    }
    throw new Error(`Behaviour manager error - type is missing`);
  }
}

BehaviourManager.registerBuilder(new RotationBehaviourBuilder());