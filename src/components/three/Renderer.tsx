import * as THREE from 'three';

const createRenderer = (
    canvas: HTMLCanvasElement,
    width: number = window.innerWidth,
    height: number = window.innerHeight,
) => {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2: 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;
    
    return renderer;
};

export default createRenderer;