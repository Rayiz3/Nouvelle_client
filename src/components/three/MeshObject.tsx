import * as CAN from 'cannon-es';
import { Box3, BoxGeometry, BufferGeometry, CanvasTexture, ClampToEdgeWrapping, Euler, Group, LinearFilter, LinearMipmapLinearFilter, Material, Mesh, MeshLambertMaterial, Object3D, PointLight, Scene, Texture, TextureLoader, TorusGeometry, Vector2, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { cannon } from './Physics';
import { TextPlane, TextSprite } from './Text';
import * as simpleIcons from 'simple-icons';

export interface ThreeObjectType {
    scene: Scene
    name: string
    width?: number
    height?: number
    depth?: number
    refPosition?: Vector3
    position?: Vector3
    rotation?: Euler
    scale?: Vector3
    mass?: number
    render?: boolean
}

export interface cannonBodyType extends CAN.Body {
    name?: string;
}

interface MeshObjectType extends ThreeObjectType {
    color?: string
    cannonMaterial?: CAN.Material
    pivotGround?: boolean
    geometry?: BufferGeometry
}

interface CustomMeshObjectType extends MeshObjectType {
    material?: Material
}

interface GLTFMeshObjectType extends MeshObjectType {
    loader: GLTFLoader
    source: string
    mapSource?: string | Texture
    normal?: boolean
    autoCannon?: boolean
}

interface LinkPostType extends GLTFMeshObjectType {
    href: string
}

interface CushionType extends GLTFMeshObjectType {
    slug: string
}

const listStack = Object.values(simpleIcons) as simpleIcons.SimpleIcon[];

export class ThreeObject {
    scene: Scene
    name: string
    width: number
    height: number
    depth: number
    refPosition: Vector3
    position: Vector3
    rotation: Euler
    scale: Vector3
    mass: number
    cannonBody: CAN.Body

    constructor(info: ThreeObjectType) {
        this.scene = info.scene;
        this.name = info.name;

        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;

        this.refPosition = info.refPosition || new Vector3(0, 0, 0);
        this.position = info.position || new Vector3(0, 0, 0);
        this.rotation = info.rotation || new Euler(0, 0, 0);
        this.scale = info.scale || new Vector3( 1, 1, 1 );

        this.position.add(this.refPosition);

        this.mass = info.mass || 0;

        this.cannonBody = this.setCannonBody();
        (this.cannonBody as cannonBodyType).name = this.name;
    }

    setCannonBody = () => {
        const cannonBody = new CAN.Body({
            mass: this.mass,
            position: new CAN.Vec3(this.position.x, this.position.y, this.position.z),
        })

        // initial rotation
        // rotation along X
        const quatX = new CAN.Quaternion();
        const axisX = new CAN.Vec3(1, 0, 0);
        quatX.setFromAxisAngle(axisX, this.rotation.x);

        // rotation along Y
        const quatY = new CAN.Quaternion();
        const axisY = new CAN.Vec3(0, 1, 0);
        quatY.setFromAxisAngle(axisY, this.rotation.y);

        // rotation along Z
        const quatZ = new CAN.Quaternion();
        const axisZ = new CAN.Vec3(0, 0, 1);
        quatZ.setFromAxisAngle(axisZ, this.rotation.z);

        const combineQuat = quatX.mult(quatY).mult(quatZ)
        cannonBody.quaternion = combineQuat;

        return cannonBody
    }
}

export class MeshObject extends ThreeObject {
    color: string | null
    mesh: Object3D
    render: boolean

    constructor(info: MeshObjectType) {
        super(info);
        
        this.color = info.color || null;
        this.mesh = new Mesh();
        this.render = info.render ?? true;
        this.cannonBody.material = info.cannonMaterial || cannon.defaultMaterial;
    }

    // fast refresh reload - cannon body (for debugging)
    putCannonBody = () => {
        const exisitngBody = cannon.world.bodies.find(b => (b as cannonBodyType).name === this.name)
        if (exisitngBody) cannon.world.removeBody(exisitngBody);

        cannon.world.addBody(this.cannonBody);
    }

    // fast refresh reload - mesh (for debugging)
    putMesh = () => {
        const existingMesh = this.scene.getObjectByName(this.name);
        if (existingMesh) this.scene.remove(existingMesh);
        
        this.scene.add(this.mesh);
    }

    toggle = (_info: any) => {
        // placeholder
    }

    hover = () => {
        // placeholder
    }

    unhover = () => {
        // placeholder
    }
}

export class CustomMeshObject extends MeshObject {

    constructor(info: CustomMeshObjectType) {
        super(info);

        const geometry = info.geometry || new BoxGeometry(this.width, this.height, this.depth);
        const material = info.material || new MeshLambertMaterial({color: this.color || 'white'});

        // ground pivoting
        if (info.pivotGround ?? true){
            this.position.y += this.height * this.scale.y / 2;
            this.cannonBody.position.y = this.position.y;
        }

        // Mesh initialization
        this.mesh = new Mesh(geometry, material);
        this.mesh.name = this.name;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
        this.mesh.scale.copy(this.scale);
        
        // cannonBody shaping
        this.buildCollider()

        if (this.render) {
            this.putCannonBody();
            cannon.cannonObjects.push(this);
            this.putMesh();
        }
    }

    protected buildCollider(): void {
        this.cannonBody.addShape(new CAN.Box(new CAN.Vec3(
            this.width/2 * this.scale.x,
            this.height/2 * this.scale.y,
            this.depth/2 * this.scale.z
        )));
    }
}

export class Poster extends CustomMeshObject {
    constructor (info: CustomMeshObjectType) {
        super(info);
    }

    override buildCollider(): void {
        
    }
}

export class GLTFMeshObject extends MeshObject {
    normal: boolean
    autoCannon: boolean

    constructor(info: GLTFMeshObjectType) {
        super(info);
        this.normal = info.normal ?? false;
        this.autoCannon = info.autoCannon ?? true;

        info.loader.load(
            info.source,
            (gltf: GLTF) => {
                gltf.scene.traverse((child: Object3D) => {
                    if ((child as Mesh).isMesh) {
                        const mesh = child as Mesh;
                        mesh.name = this.name;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;

                        const texture = info.mapSource
                            ? (info.mapSource instanceof Texture)
                                ? info.mapSource
                                : new TextureLoader().load(info.mapSource)
                            : null;
                        
                        if (texture) {
                            mesh.material = new MeshLambertMaterial({
                                color: "white",
                                map: texture,
                            })
                        } else if (this.color){
                            mesh.material = new MeshLambertMaterial({
                                color: this.color,
                                map: (mesh.material as MeshLambertMaterial).map,
                            })
                        }

                        child.name = this.name;
                    }
                })

                // getting size
                const box = new Box3().setFromObject(gltf.scene);
                const size = new Vector3();
                box.getSize(size);
                
                if (this.autoCannon){
                    this.width = size.x,
                    this.height = size.y,
                    this.depth = size.z;
                }
                
                if (this.normal) {
                    const maximum = Math.max(this.width, this.height, this.depth);
                    this.scale.copy(new Vector3(this.scale.x / maximum, this.scale.y / maximum, this.scale.z / maximum));
                }

                // ground pivoting
                if (info.pivotGround ?? true){
                    this.position.y += this.height * this.scale.y / 2;
                    this.cannonBody.position.y = this.position.y;
                }

                // Mesh initialization
                this.mesh = gltf.scene as Group;
                this.mesh.name = this.name;
                this.mesh.position.copy(this.position);
                this.mesh.rotation.copy(this.rotation);
                this.mesh.scale.copy(this.scale);
                // function binding
                this.mesh.userData.toggle = this.toggle;
                this.mesh.userData.hover = this.hover;
                this.mesh.userData.unhover = this.unhover;

                // cannonBody shaping
                this.buildCollider();

                if (this.render) {
                    this.putCannonBody();
                    cannon.cannonObjects.push(this);
                    this.putMesh();
                }
                
                // overriding due to the asynchronus task of GLTFMeshObject loading
                this.callback();
            },
            (xhr: ProgressEvent<EventTarget>) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (_: any) => {
                console.error('An error happened');
            }
        )
    }

    callback(): void {
        // placeholder
    }

    protected buildCollider(): void {
        this.cannonBody.addShape(new CAN.Box(new CAN.Vec3(
            this.width/2 * this.scale.x,
            this.height/2 * this.scale.y,
            this.depth/2 * this.scale.z
        )));
    }
}

export class LinkPost extends GLTFMeshObject {
    href: string
    textLink: TextPlane

    constructor (info: LinkPostType) {
        super(info);
        this.href = info.href;

        const worldPos = new Vector3(this.position.x, this.position.y, this.position.z - 0.05);
        const localPos = this.mesh.worldToLocal(worldPos.clone());

        this.textLink = new TextPlane({
            scene: this.scene,
            parent: this.mesh,
            name: `${this.name}_link`,
            text: this.href,
            fontSize: 20,
            meshSize: new Vector2(0.5, 0.5),
            color: 'black',
            stroke: false,
            position: localPos,
            rotation: new Euler(0, Math.PI, 0),
        })

        // function binding
        this.textLink.mesh.userData.toggle = this.toggle;
        this.textLink.mesh.userData.hover = this.hover;
        this.textLink.mesh.userData.unhover = this.unhover;
    }

    toggle = () => {
        //console.log("opening link:", this.href);
        window.open(this.href, '_blank');
    }
}

export class Lamp extends GLTFMeshObject {
    light: PointLight

    constructor (info: GLTFMeshObjectType) {
        super(info);
        this.light = new PointLight('#dda6ab', 0, 50);
    }

    toggle = () => {
        this.light.intensity = (this.light.intensity === 0)? 7 : 0;
    }

    // overriding due to the asynchronus task of GLTFMeshObject loading
    override callback(): void {
        super.callback();
        
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 2048;
        this.light.shadow.mapSize.height = 2048;
        this.light.position.y = 0.75;
        this.light.intensity = 7;

        this.mesh?.add(this.light);
    }
    
    override buildCollider(): void {
        this.cannonBody.addShape(new CAN.Cylinder(this.width/2 * this.scale.x, this.width/2 * this.scale.y, this.height * this.scale.z));
    }
}

export class Cushion extends GLTFMeshObject {
    hoverLabel!: TextSprite

    constructor(info: CushionType) {
        // finding stack by slug
        const stack = listStack.filter(e => e.slug === info.slug)[0];
        const textureSize = 1024;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;

        canvas.width = textureSize;
        canvas.height = textureSize;

        // draw - background
        context.fillStyle = `#${stack.hex}`;
        context.fillRect(0, 0, textureSize, textureSize)

        const texture = new CanvasTexture(canvas);
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.anisotropy = 4;

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#ffffff" d="${stack.path}"/>
            </svg>`;
        const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        // draw - central single icon
        const img = new Image();
        img.onload = () => {
            const iconSize = Math.floor(textureSize * 0.5);
            const margin = Math.floor((textureSize - iconSize) / 2);
            context.drawImage(img, margin, margin, iconSize, iconSize)

            texture.needsUpdate = true;
        }
        img.src = url;

        const defaultCushionInfo = {
            geometry: new TorusGeometry(0.12, 0.05, 5, 10),
            mass: 10,
            width: 0.37,
            height: 0.37,
            depth: 0.1,
            mapSource: texture,
        };
        const cushionInfo = { ...defaultCushionInfo, ...info };

        super(cushionInfo);
    }

    toggle = (info: {direction: Vector3}) => {
        const forceDirec = info.direction.clone().setY(0);
        forceDirec.normalize();
        const forcePoint = this.cannonBody.position.clone();

        const strength = 1.0;
        const impulse = new CAN.Vec3(
            forceDirec.x * strength * this.cannonBody.mass,
            forceDirec.y * strength * this.cannonBody.mass,
            forceDirec.z * strength * this.cannonBody.mass,
        )

        this.cannonBody.wakeUp?.();
        this.cannonBody.applyImpulse(impulse, forcePoint);
    }

    hover = () => {
        this.hoverLabel.sprite.visible = true;
    }

    unhover = () => {
        this.hoverLabel.sprite.visible = false;
    }

    override callback(): void {
        super.callback();

        const labelText = listStack.filter(e => e.slug === this.name.replace("cushion_", ""))[0].title;

        const worldPos = new Vector3(this.position.x, this.position.y + this.width/2 + 0.1, this.position.z);
        const localPos = this.mesh.worldToLocal(worldPos.clone());

        this.hoverLabel = new TextSprite({
            scene: this.scene,
            name: `label_${this.name}`,
            text: `${labelText}`,
            fontSize: 20,
            refPosition: this.position,
            position: localPos,
            parent: this.mesh,
        })
        this.hoverLabel.sprite.visible = false;
    }

    override buildCollider(): void {
        this.cannonBody.addShape(
            new CAN.Sphere(this.depth/2 * this.scale.z),
            new CAN.Vec3(this.width/6 * this.scale.x, this.height/6 * this.scale.y, 0)
        );
        this.cannonBody.addShape(
            new CAN.Sphere(this.depth/2 * this.scale.z),
            new CAN.Vec3(-this.width/6 * this.scale.x, this.height/6 * this.scale.y, 0)
        );
        this.cannonBody.addShape(
            new CAN.Sphere(this.depth/2 * this.scale.z),
            new CAN.Vec3(this.width/6 * this.scale.x, -this.height/6 * this.scale.y, 0)
        );
        this.cannonBody.addShape(
            new CAN.Sphere(this.depth/2 * this.scale.z),
            new CAN.Vec3(-this.width/6 * this.scale.x, -this.height/6 * this.scale.y, 0)
        );
    }
}

export class Display extends GLTFMeshObject {
    light: PointLight

    constructor (info: GLTFMeshObjectType) {
        super(info);
        this.light = new PointLight('white', 1,5);
    }

    // overriding due to the asynchronus task of GLTFMeshObject loading
    override callback(): void {
        super.callback();
        
        this.light.castShadow = true;
        this.light.position.set(this.position.x, this.position.y+1.0, this.position.z);
        this.light.name = "light_display";
        this.light.intensity = 1;

        this.scene.add(this.light);
    }
}