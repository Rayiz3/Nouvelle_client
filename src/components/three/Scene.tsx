import * as THREE from 'three';

const createScene = (transparent: boolean = false) => {
  const scene = new THREE.Scene();
  scene.background = transparent? null : new THREE.Color(0x291455);
  return scene;
};

export default createScene;