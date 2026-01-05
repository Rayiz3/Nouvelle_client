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

    // sun light
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            viewVector: {value: new THREE.Vector3()},
            c: {value: 0.5},
            p: {value: 2.0},
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float c;
            uniform float p;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
                gl_FragColor = vec4(1.0, 0.8, 0.4, 1.0) * intensity;
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });
    
    const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), glowMaterial); // Slightly larger sphere
    glowMesh.position.set(60, 30, 0)
    lights.push(glowMesh);

    return lights;
};

export default createLights;