import * as THREE from 'three';

interface cameraProps {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    position?: [number, number, number];
    lookAt?: [number, number, number];
    name?: string;
}

const createCamera = ({
    fov = 60,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.5,
    far = 100,
    position = [4, 3, 4],
    lookAt = [10, 2, 10],
    name = "camera"
}: cameraProps = {}) => {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(...position);
    camera.lookAt(...lookAt);
    camera.name = name;
    return camera;
};

export default createCamera;