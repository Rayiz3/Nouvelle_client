import * as CAN from 'cannon-es';
import { CapsuleGeometry, Mesh, MeshLambertMaterial } from "three";
import { MeshObject, ThreeObjectType } from "./MeshObject";
import { cannon } from './Physics';

interface PlayerType extends ThreeObjectType {
    mass: number
}

type directions = 'left' | 'right' | 'forward' | 'backward';

class Player extends MeshObject {
    isJumping: boolean

    constructor(info: PlayerType) {
        super(info);

        const geometry = new CapsuleGeometry(this.width / 2, this.height - this.width);
        const material = new MeshLambertMaterial({
            transparent: false,
            opacity: 1.0,
        })
        
        this.mesh = new Mesh(geometry, material);
        this.mesh.name = this.name
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
                
        // cannonBody shaping
        //this.cannonBody.addShape(new CAN.Box(new CAN.Vec3(this.width/2, this.height/2, this.depth/2)));
        this.cannonBody.addShape(new CAN.Cylinder(this.width/2, this.width/2, this.height));

        this.isJumping = false;
        
        this.cannonBody.material = cannon.playerMaterial;

        // fixing rotation
        this.cannonBody.fixedRotation = true;
        this.cannonBody.updateMassProperties();

        this.putCannonBody();
        this.putMesh();
    }

    walk = (value: number, direction: directions) => {
        let direct = {x: 0, z: 0};

        if (direction === 'left') {
            direct.x = -Math.sin(this.rotation.y + Math.PI / 2);
            direct.z = -Math.cos(this.rotation.y + Math.PI / 2);
        }
        if (direction === 'right') {
            direct.x = Math.sin(this.rotation.y + Math.PI / 2);
            direct.z = Math.cos(this.rotation.y + Math.PI / 2);
        }
        if (direction === 'forward') {
            direct.x = -Math.sin(this.rotation.y);
            direct.z = -Math.cos(this.rotation.y);
        }
        if (direction === 'backward') {
            direct.x = Math.sin(this.rotation.y);
            direct.z = Math.cos(this.rotation.y);
        }
        this.position.x += direct.x * value;
        this.position.z += direct.z * value;

        this.cannonBody.position.copy(new CAN.Vec3(this.position.x, this.position.y, this.position.z));
    }

    jump = () => {
        this.isJumping = true;
        this.cannonBody.velocity.y = 5;
        
        setTimeout(() => {
            this.isJumping = false;
        }, 1000);
    }

    update = () => {
        this.mesh.position.copy(this.cannonBody.position);
        this.position.copy(this.cannonBody.position);

        if (this.cannonBody.velocity.y === 0) {
            this.isJumping = false; // reset jumping
        }
    }
}

export default Player