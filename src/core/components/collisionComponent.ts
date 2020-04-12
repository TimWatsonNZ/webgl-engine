
import { BaseComponent } from "./baseComponent";
import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";

import { IShape2D } from "../graphics/shape2D.ts/IShape2D";
import { Rectangle2D } from "../graphics/shape2D.ts/rectangle2d";
import { Circle2D } from "../graphics/shape2D.ts/circle2D";

import { Shader } from "../gl/shaders/shader";
import { CollisionManager } from "../collision/collisionManager";

export class CollisionComponentData implements IComponentData {
  public name: string;
  public shape: IShape2D;
  public static: boolean = true;

  public setFromJson(json: any): void {
    if (json.name !== undefined) {
      this.name = String(json.name);
    }

    if (json.static !== undefined) {
      this.static = Boolean(json.static);
    }

    if (json.name === undefined) {
      throw new Error(`CollisionComponentData requires 'shape' to be present.`);
    } else {
      if (json.shape.type === undefined) {
        throw new Error(`CollisionComponentData requires 'type' to be present.`);
      }

      switch(String(json.shape.type).toLowerCase()) {
        case "rectangle":
          this.shape = new Rectangle2D();
          break;  
        case "circle":
          this.shape = new Circle2D();
          break;  
        default:
          throw new Error(`Unsupported shape type: '${json.shape.type}'`);
      }

      this.shape.setFromJson(json.shape);
    }
  }
}

export class CollisionComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return "collision";
  }

  public buildFromJson(json: any): CollisionComponent {
    const data = new CollisionComponentData();
    data.setFromJson(json);

    return new CollisionComponent(data);
  }
}

export class CollisionComponent extends BaseComponent {
  private _shape: IShape2D;
  private _static: boolean;

  public constructor(data: CollisionComponentData) {
    super(data);

    this._shape = data.shape;
    this._static = data.static;
  }

  public get shape(): IShape2D {
    return this._shape;
  }

  public get isStatic(): boolean {
    return this._static;
  }

  public load(): void {
    super.load();

    this._shape.position.copyFrom(this.owner.getWorldPosition().toVector2().add(this._shape.offset));
    CollisionManager.registerCollisionComponent(this);
  }

  public update(time: number): void {
    this._shape.position.copyFrom(this.owner.getWorldPosition().toVector2().add(this._shape.offset));

    super.update(time);
  }

  public render(shader: Shader): void {
    super.render(shader);
  }

  public onCollisionEntry(other: CollisionComponent): void {

  }

  public onCollisionUpdate(other: CollisionComponent): void {
    // console.log('CollisionUpdate');
  }

  public onCollisionExit(other: CollisionComponent): void {
    console.log('CollisionExit');
  }
}
