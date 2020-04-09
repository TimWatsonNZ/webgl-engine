import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { SpriteComponentBuilder } from "./spriteComponent";
import { AnimatedSpriteComponentBuilder } from "./animatedSpriteComponent";
import { CollisionComponentBuilder } from "./collisionComponent";

export class ComponentManager {
  private static _registeredBuilders: { [key: string]: IComponentBuilder } = {};

  public static registerBuilder(builder: IComponentBuilder): void {
    ComponentManager._registeredBuilders[builder.type] = builder;
  }

  public static extractComponent(json: any): IComponent {
    if (json.type !== undefined) {

      if (ComponentManager._registeredBuilders[json.type] !== undefined) {
        return ComponentManager._registeredBuilders[String(json.type)].buildFromJson(json);
      }
    }
    throw new Error(`Component manager error - type is missing`);
  }
}

ComponentManager.registerBuilder(new SpriteComponentBuilder());
ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
ComponentManager.registerBuilder(new CollisionComponentBuilder());