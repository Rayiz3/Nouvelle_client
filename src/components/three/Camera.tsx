import * as THREE from 'three';

const createCamera = () => {
    const camera = new THREE.PerspectiveCamera(
        60, // fov
        window.innerWidth / window.innerHeight, // aspect
        0.5, // near
        100 // far
    );
    camera.position.set(4, 3, 4);
    camera.lookAt(10, 2, 10);
    camera.name = "camera";
    return camera;
};

export default createCamera;