// import { Zone } from "./zone";
// import { SimObject } from "./simObject";
// import { SpriteComponent } from "../components/spriteComponent";

// export class TestZone extends Zone {

//   private _parentObject: SimObject;
//   private _testObject: SimObject;


//   private _testSprite: SpriteComponent;

//   public load(): void {
//     this._parentObject = new SimObject(0, "parentObject");
//     this._parentObject.transform.position.x = 300;
//     this._parentObject.transform.position.y = 300;

//     this._testObject = new SimObject(1, 'Test Object');
//     this._testSprite = new SpriteComponent('Test', 'crate');
//     this._testObject.addComponent(this._testSprite);

//     this._testObject.transform.position.x = 30;
//     this._testObject.transform.position.y = 30;

//     this._testObject.transform.scale.x = 3;
//     this._testObject.transform.scale.y = 3;

//     this._parentObject.addChild(this._testObject);

//     this.scene.addObject(this._parentObject);

//     super.load();
//   }

//   public update(time: number): void {
//     this._parentObject.transform.rotation.z += 0.01;
//     super.update(time);
//   }
// }