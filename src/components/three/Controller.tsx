import { Camera, Clock, Euler, Object3D, Raycaster, Vector2, Vector3 } from "three";
import Player from "./Player";
import { useMyStore } from "../../system/My";

class Controller {
    clock: Clock

    keys: Record<string, boolean>;
    agent: Player | null;

    mousePos: Vector2;
    mouseDel: Vector2;
    raycaster: Raycaster;

    euler: Euler;
    minPolarAngle: number;
    maxPolarAngle: number;
    camOffset: Vector3;

    hoverRaf: boolean;
    lastHovered: Object3D | null;

    constructor() {
        this.clock = new Clock();

        this.keys = {};
        this.agent = null;

        this.mousePos = new Vector2();
        this.mouseDel = new Vector2();
        this.raycaster = new Raycaster();

        this.euler = new Euler(0, 0, 0, 'YXZ');
        this.minPolarAngle = -Math.PI / 2;
        this.maxPolarAngle = Math.PI / 2;
        this.camOffset = new Vector3(0, 1, 0);

        this.hoverRaf = false;
        this.lastHovered = null;

        window.addEventListener('keydown', event => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', event => {
            delete this.keys[event.code];
        })
    }

    move = () => {
        if (!useMyStore.getState().isEdit){
            if (this.keys['KeyW'] || this.keys["ArrowUp"]){
                this.agent?.walk(0.02, 'forward');
            }
            if (this.keys['KeyS'] || this.keys["ArrowDown"]){
                this.agent?.walk(0.02, 'backward');
            }
            if (this.keys['KeyA'] || this.keys["ArrowLeft"]){
                this.agent?.walk(0.02, 'left');
            }
            if (this.keys['KeyD'] || this.keys["ArrowRight"]){
                this.agent?.walk(0.02, 'right');
            }
            if (this.keys['Space'] && !this.agent?.isJumping){
                this.agent?.jump();
            }
        }
    }

    // called only if it is game mode
    updateMouse = (e: MouseEvent) => {
        this.mouseDel.x = e.movementX * 0.001;
        this.mouseDel.y = e.movementY * 0.001;

        this.mousePos.x = 0;
        this.mousePos.y = 0;
    }

    // helper function for finding MeshObject that the Mesh belongs
    findOwner = (obj: Object3D | null, method: string) => {
        let curObj = obj;
        while (curObj && !curObj.userData?.[method]){
            curObj = curObj.parent;
        }
        return curObj ?? null;
    }

    getClickIntersects = (mode: string, targets: Object3D[], camera: Camera, exceptedName?: string) => {
        // create a ray that emits from the camera to the mouse position
        this.raycaster.setFromCamera(this.mousePos, camera);

        // children items that are hit by the ray
        const intersects = this.raycaster
            .intersectObjects(targets, true)
            .filter(e => e.object.name !== exceptedName);

        //console.table(intersects
        //    .map(e => ({
        //        name: e.object.name,
        //        type: e.object.type,
        //        children: e.object.children.length
        //    }))
        //);

        if (intersects.length > 0) {
            let selectedObject: Object3D | null = intersects[0]?.object;

            if (mode === 'clicked') {
                //console.log("selected : ", selectedObject.name);
                selectedObject = this.findOwner(selectedObject, "toggle");
                if (selectedObject?.name.includes("cushion")){
                    selectedObject?.userData?.toggle?.({
                        direction: this.raycaster.ray.direction.clone(),
                    });
                } else {
                    selectedObject?.userData?.toggle?.();
                }
            }
            else if (selectedObject.name !== this.lastHovered?.name) {
                //console.log("hovered : ", selectedObject.name);
                this.lastHovered?.userData?.unhover?.();

                selectedObject = this.findOwner(selectedObject, "hover");
                selectedObject?.userData?.hover?.();

                this.lastHovered = selectedObject;
            }
        }
        else if (this.lastHovered) {
            this.lastHovered.userData?.unhover?.();
            this.lastHovered = null;
        }
    }

    getHoverIntersects = (targets: Object3D[], camera: Camera) => {
        if (this.hoverRaf) this.getClickIntersects("hovered", targets, camera);
    }

    rotate = (camera: Camera) => {
        this.euler.setFromQuaternion(camera.quaternion);
        // yaw
        this.euler.y -= this.mouseDel.x;
        // pitch
        this.euler.x -= this.mouseDel.y;
        // clamp
        this.euler.x = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.euler.x));

        // smoothing
        this.mouseDel.x *= 0.8;
        this.mouseDel.y *= 0.8;
        if (Math.abs(this.mouseDel.x) < 0.1) this.mouseDel.x = 0;
        if (Math.abs(this.mouseDel.y) < 0.1) this.mouseDel.y = 0;
        
        camera.quaternion.setFromEuler(this.euler);

        if (this.agent) {
            // apply camera direction to the player direction
            this.agent.rotation.y = this.euler.y;

            // position
            camera.position.copy(this.agent.position.clone().add(this.camOffset));
        }
    }
}

export const controller = new Controller();