import React, { useEffect } from 'react';
import * as THREE from 'three';
import createRenderer from '../three/Renderer';
import createCamera from '../three/Camera';
import createScene from '../three/Scene';
import { GLTF, GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useMyStore } from '../../system/My';

const Preview: React.FC = () => {
    const iconMeshUrl = useMyStore(state => state.editingIconMeshUrl);

    const rotateSpeed = Math.PI / 8;
    const clock = new THREE.Clock();

    useEffect(() => {
        const canvas = document.getElementById('icon-mesh') as HTMLCanvasElement;
        const renderer = createRenderer(canvas, canvas.clientWidth, canvas.clientHeight);
        renderer.setClearAlpha(0);
        const camera = createCamera({
            fov: 45,
            aspect: canvas.clientWidth / canvas.clientHeight,
            position: [3, 3, 3],
            lookAt: [0, 0, 0],
        });
        const scene = createScene(true);

        const light = new THREE.AmbientLight('white', 1);
        const pLight = new THREE.PointLight('white', 50);
        pLight.position.set(3, 3, 0);
        pLight.castShadow = true;

        scene.add(camera);
        scene.add(light);
        scene.add(pLight);

        let iconMesh: THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;

        // default cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial();
        iconMesh = new THREE.Mesh(geometry, material);

        iconMesh.castShadow = true;
        iconMesh.receiveShadow = true;
        iconMesh.rotateOnAxis(new THREE.Vector3(1, 0, 0,), Math.PI / 8);

        scene.add(iconMesh);

        // loaded icon mesh
        if (iconMeshUrl) {
            new GLTFLoader().load(
                iconMeshUrl,
                (gltf: GLTF) => {
                    scene.remove(iconMesh); // replace default cube
                    
                    const iconMeshGLTF = gltf.scene.children[0] as THREE.Mesh;
                    iconMeshGLTF.name = "icon mesh";
                    iconMeshGLTF.castShadow = true;
                    iconMeshGLTF.receiveShadow = true;

                    iconMeshGLTF.position.set(0, 0, 0);
                    iconMeshGLTF.rotation.set(Math.PI / 8, 0, 0);

                    iconMesh = iconMeshGLTF;
                    scene.add(iconMesh);
                },
                () => {},
                (error) => {
                    console.error('GLB file loading failed:', error);
                }
            )
        }

        // Update Loop
        const update = () => {
            const delta = clock.getDelta();

            iconMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotateSpeed * delta);

            renderer.render(scene, camera);
            
            renderer.setAnimationLoop(update);
        }

        update();

        return () => {
            renderer.setAnimationLoop(null);
        }
    }, [iconMeshUrl])

    return null;
}

export default Preview;