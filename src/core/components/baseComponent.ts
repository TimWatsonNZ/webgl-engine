import { SimObject } from "../world/simObject";
import { Shader } from "../gl/shaders/shader";
import { IComponentData } from "./IComponentData";
import { IComponent } from "./IComponent";

export abstract class BaseComponent implements IComponent {
  public name: string;
  protected _owner: SimObject;
  protected _data: IComponentData;

  public constructor(data: IComponentData) {
    this._data = data;
    this.name = data.name;
  }

  public get owner(): SimObject {
    return this._owner;
  }

  public setOwner(owner: SimObject): void {
    this._owner = owner;
  }

  public load(): void {
    
  }
  
  public updateReady(): void {

  }

  public update(time: number): void {

  }
  
  public render(shader: Shader): void {
    
  }
}