import { IShape2D } from "./IShape2D";
import { Vector2 } from "../../math/vector2";

export class Circle2D implements IShape2D {
  public position: Vector2 = Vector2.zero;

  public offset: Vector2 = Vector2.zero;

  public radius: number;

  public setFromJson(json: any): void {
    if (json.position !== undefined) {
      this.position.setFromJson(json.position);
    }

    if (json.offset !== undefined) {
      this.offset.setFromJson(json.offset);
    }

    if (json.radius === undefined) {
      throw new Error(`Circle2D requires radius to be present`);
    }

    this.radius = Number(json.radius);
  }

  intersects(other: IShape2D): boolean {
    if (other instanceof Circle2D) {
      const distance = Math.abs(Vector2.distance(other.position, this.position));
      const radiusSum = this.radius + other.radius;

      return distance === radiusSum;
    }
  }

  pointInShape(point: Vector2): boolean {
    const absDistance = Math.abs(Vector2.distance(this.position, point));

    return absDistance <= this.radius;
  }
  
}