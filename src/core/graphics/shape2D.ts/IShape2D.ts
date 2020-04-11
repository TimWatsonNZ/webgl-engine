import { Vector2 } from "../../math/vector2";

export interface IShape2D {
  position: Vector2;

  offset: Vector2;

  setFromJson(json: any): void;

  intersects(other: IShape2D): boolean;

  pointInShape(point: Vector2): boolean;
}