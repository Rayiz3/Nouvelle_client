import * as CAN from 'cannon-es';
import { MeshObject } from './MeshObject';

class Cannon {
    world: CAN.World
    defaultMaterial: CAN.Material
    playerMaterial: CAN.Material
    defaultContactMaterial: CAN.ContactMaterial
    playerContactMaterial: CAN.ContactMaterial
    cannonObjects: MeshObject[]
    stepTime: number

    constructor() {
        // world
        this.world = new CAN.World();
        this.world.gravity.set(0, -10, 0);

        // material
        this.defaultMaterial = new CAN.Material('default');
        this.playerMaterial = new CAN.Material('player');

        // interaction
        this.defaultContactMaterial = new CAN.ContactMaterial(
            this.defaultMaterial,
            this.defaultMaterial,
            {
                friction: 1,
                restitution: 0.2
            }
        );

        this.world.defaultContactMaterial = this.defaultContactMaterial;
        this.playerContactMaterial = new CAN.ContactMaterial(
            this.playerMaterial,
            this.defaultMaterial,
            {
                friction: 10,
                restitution: 0,
            }
        )
        this.world.addContactMaterial(this.playerContactMaterial);

        this.cannonObjects = [];
        this.stepTime = 1/60;
    }

    update = (delta: number) => {
        const stepTime = (delta < 0.01)? 1/120 : 1/60;
        this.world.step(stepTime, delta, 3);

        // update objects' transforms
        for (const object of this.cannonObjects){
            object.mesh!.position.copy(object.cannonBody.position);
            object.mesh!.quaternion.copy(object.cannonBody.quaternion);
        }
    }
}

export const cannon = new Cannon();