import * as THREE from 'three';

const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x291455);
  return scene;
};

export default createScene;