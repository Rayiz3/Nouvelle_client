import * as THREE from 'three';

const createLights = () => {
    const lights = [];

    // ambient light
    const ambientLight = new THREE.AmbientLight('white', 1);
    ambientLight.name = "light_ambient"
    lights.push(ambientLight);

    // hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    hemisphereLight.name = "light_hemisphere"
    lights.push(hemisphereLight);

    // directional light
    const directionalLight = new THREE.DirectionalLight('white', 10);
    directionalLight.position.set(-2, 10, -5);
    directionalLight.castShadow = true;
    //lights.push(directionalLight);

    // point light
    const pointLight = new THREE.PointLight('white', 100, 100);
    pointLight.position.set(-1, 10, -1);
    pointLight.castShadow = true;
    pointLight.name = "light_point"
    lights.push(pointLight);

    return lights;
};

export default createLights;