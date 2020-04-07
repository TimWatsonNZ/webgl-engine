import { IBehaviour } from "./IBehaviour";

export interface IBehaviourBuilder {
  readonly type: string;

  buildFromJson(json: any): IBehaviour;
  
}