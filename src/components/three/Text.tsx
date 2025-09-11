import * as THREE from 'three'

interface textCanvasType {
    scene: THREE.Scene
    name: string
    text?: string
    fontSize?: number
    canvasSize?: THREE.Vector2
    meshSize?: THREE.Vector2
    color?: string
    stroke?: boolean
    refPosition?: THREE.Vector3
    position?: THREE.Vector3
    rotation?: THREE.Euler
    parent?: THREE.Object3D
}

class TextCanvas {
    name: string
    refPosition: THREE.Vector3
    position: THREE.Vector3
    rotation: THREE.Euler
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    textTexture: THREE.CanvasTexture
    text: string
    fontSize: number

    constructor(info: textCanvasType) {
        this.name = info.name;

        this.refPosition = info.refPosition || new THREE.Vector3(0, 0, 0);
        this.position = info.position || new THREE.Vector3(0, 0, 0);
        if (!info.parent) this.position.add(this.refPosition);
        this.rotation = info.rotation || new THREE.Euler(0, 0, 0);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        // canvas resolution (not a font size)
        this.canvas.width = info.canvasSize?.x || 256;
        this.canvas.height = info.canvasSize?.y || 256;
        this.text = info.text || "blank";
        this.fontSize = info.fontSize || 36;

        this.context.fillStyle = info.color || 'white';
        this.context.font = `${this.fontSize}px Pretendard`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = 'black';
        this.context.lineWidth = this.fontSize * 0.1;

        // drawing
        if (info.stroke ?? true){
            this.context.strokeText(this.text, this.canvas.width/2, this.canvas.height/2);
        }
        this.context.fillText(this.text, this.canvas.width/2, this.canvas.height/2);

        // texture
        this.textTexture = new THREE.CanvasTexture(this.canvas);
        this.textTexture.minFilter = THREE.LinearFilter;
    }

    toggle = () => {
        window.open(this.text, "_blank");
    }
}

export class TextSprite extends TextCanvas {
    spriteMaterial: THREE.SpriteMaterial
    sprite: THREE.Sprite

    constructor(info: textCanvasType) {
        super(info);

        // material
        this.spriteMaterial = new THREE.SpriteMaterial({
            map: this.textTexture,
            transparent: true, // background opacity
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false,
        })

        // sprite
        this.sprite = new THREE.Sprite(this.spriteMaterial);

        this.sprite.position.copy(this.position);

        if (info.parent) info.parent.add(this.sprite);
        else info.scene.add(this.sprite);
    }

    setPosition = (position: THREE.Vector3) => {
        this.sprite.position.copy(position);
    }
}

export class TextPlane extends TextCanvas {
    material: THREE.MeshBasicMaterial
    mesh: THREE.Mesh

    constructor(info: textCanvasType) {
        super(info);

        const width = info.meshSize?.x || 1;
        const height = info.meshSize?.y || 1;
        
        // material
        this.material = new THREE.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true,
            side: THREE.DoubleSide,
        })
        // mesh
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.material);
        this.mesh.name = this.name;
        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);

        info.scene.add(this.mesh);
    }
}