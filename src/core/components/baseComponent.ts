import { SimObject } from "../world/simObject";
import { Shader } from "../gl/shaders/shader";
import { IComponentData } from "./IComponentData";

export abstract class BaseComponent {
  public name: string;
  protected _owner: SimObject;
  protected _data: IComponentData;

  public constructor(data: IComponentData) {
    this._data = data;
    this.name = data.name;
  }

  public get owner(): SimObject {
    return this.owner;
  }

  public setOwner(owner: SimObject): void {
    this._owner = owner;
  }

  public load(): void {
    
  }

  public update(time: number): void {

  }
  
  public render(shader: Shader): void {
    
  }
}