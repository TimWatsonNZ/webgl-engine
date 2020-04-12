import { IShape2D } from "./IShape2D";
import { Vector2 } from "../../math/vector2";
import { Rectangle2D } from "./rectangle2d";

export class Circle2D implements IShape2D {
  public position: Vector2 = Vector2.zero;

  public origin: Vector2 = Vector2.zero;

  public radius: number;

  public get offset(): Vector2 {
    return new Vector2(
      this.radius + (this.radius * this.origin.x),
      this.radius + (this.radius * this.origin.y),
    )
  }

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
      const distance = Math.abs(
        Vector2.distance(other.position, this.position)
      );
      const radiusSum = this.radius + other.radius;

      return distance === radiusSum;
    }

    if ( other instanceof Rectangle2D ) {
      let deltaX = this.position.x - Math.max( other.position.x, Math.min( this.position.x, other.position.x + other.width ) );
      let deltaY = this.position.y - Math.max( other.position.y, Math.min( this.position.y, other.position.y + other.height ) );
      if ( ( deltaX * deltaX + deltaY * deltaY ) < ( this.radius * this.radius ) ) {
          return true;
      }
    }

    return false;
  }

  pointInShape(point: Vector2): boolean {
    const absDistance = Math.abs(Vector2.distance(this.position, point));

    return absDistance <= this.radius;
  }
}