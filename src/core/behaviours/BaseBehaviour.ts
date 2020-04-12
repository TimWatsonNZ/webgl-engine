import { IBehaviourData } from "./IBehaviourData";
import { IBehaviour } from "./IBehaviour";
import { SimObject } from "../world/simObject";

export abstract class BaseBehaviour implements IBehaviour {
  public name: string;

  protected _data: IBehaviourData;
  protected _owner: SimObject;

  public constructor(data: IBehaviourData) {
    this._data = data;
    this.name = this._data.name;
  }

  public setOwner(owner: SimObject): void {
    this._owner = owner;
  }

  
  public updateReady(): void {

  }

  public update(time: number): void {
    
  }

  public apply(userData: any): void {

  }
}