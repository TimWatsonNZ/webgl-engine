import { CollisionComponent } from "../components/collisionComponent";
import { Message } from "../message/message";

export class CollisionData {
  public a: CollisionComponent;
  public b: CollisionComponent;
  public time: number;

  public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
    this.a = a;
    this.b = b;
    this.time = time;
  }

}

export class CollisionManager {
  private static _totalTime = 0;
  private static _components: CollisionComponent[] = [];

  private static _collisionData: CollisionData[] = [];

  private constructor() {

  }

  public static registerCollisionComponent(component: CollisionComponent): void {
    CollisionManager._components.push(component);
  }

  public static unregisterCollisionComponent(component: CollisionComponent): void {
    const index = CollisionManager._components.indexOf(component);
    if (index !== -1) {
      CollisionManager._components.slice(index, 1);
    }
  }

  public static clear(): void {
    CollisionManager._components.length = 0;
  }

  public static update(time: number): void {
    CollisionManager._totalTime += time;
    for (let c = 0; c < CollisionManager._components.length;c++) {
      const comp = CollisionManager._components[c];
      for (let o=0;o < CollisionManager._components.length;o++) {
        const other = CollisionManager._components[o];

        if (comp === other) continue;

        if (comp.isStatic && other.isStatic) continue;

        if (comp.shape.intersects(other.shape)) {

          let exists = false;
          for (let d = 0;d < CollisionManager._collisionData.length; ++d) {
            const data = CollisionManager._collisionData[d];

            if (
               (data.a === comp && data.b === other) ||
               (data.a === other && data.b === comp)) {
                 comp.onCollisionUpdate(other);
                 other.onCollisionUpdate(comp);
                data.time = CollisionManager._totalTime;
                exists = true;
                break;
              }
          }

          if (!exists) {
            const col = new CollisionData(CollisionManager._totalTime, comp, other);
            comp.onCollisionEntry(other);
            other.onCollisionEntry(comp);

            Message.sendPriority("COLLISION_ENTRY", this, col);
            this._collisionData.push(col);
          }
        }
      }
    }

    const removeData: CollisionData[] = [];
    for (let d = 0;d < CollisionManager._collisionData.length; ++d) {
      const data = CollisionManager._collisionData[d];

      if (data.time !== CollisionManager._totalTime) {
        removeData.push(data);
      }
    }

    while (removeData.length !== 0) {
      const data = removeData.shift();
      const index = CollisionManager._collisionData.indexOf(removeData[0]);
      CollisionManager._collisionData.splice(index, 1);
      
      data.a.onCollisionExit(data.b);
      data.b.onCollisionExit(data.a);
      Message.sendPriority("COLLISION_EXIT", undefined, data);
    }

    document.title = CollisionManager._collisionData.length.toString();
  }
}

