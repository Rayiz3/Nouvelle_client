import React, { useEffect } from "react";
import { useMyStore } from "../../system/My";
import * as THREE from 'three';

import createRenderer from "./Renderer";
import createCamera from "./Camera";
import createScene from "./Scene";
import createLights from "./Light";
import { Cushion, CustomMeshObject, GLTFMeshObject, Lamp, LinkPost, Poster } from "./MeshObject";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Player from "./Player";
import { cannon } from "./Physics";
import CannonDebugger from "cannon-es-debugger";
import { controller } from "./Controller";
import { TextPlane } from "./Text";

const Room: React.FC = () => {
    const config = useMyStore(state => state.config);
    const clock = new THREE.Clock();
    let delta = clock.getDelta();
    const isDebugging = false;

    useEffect(() => {
        const canvas = document.getElementById('room') as HTMLCanvasElement;

        // Envinronments //
        const renderer = createRenderer(canvas);
        const camera = createCamera();
        const scene = createScene();
        const lights = createLights();
        const gltfLoader = new GLTFLoader();
        const cannonDebugger = CannonDebugger(scene, cannon.world, { color: 0x00ff00});

        scene.add(camera);
        scene.add(...lights);

        // Objects - Stage //

        const sizeStage = 10;
        const sizeRoom = 7;
        const thickRoom = 0.4;

        new CustomMeshObject({
            scene,
            name: 'land',
            width: 100,
            height: 0.1,
            depth: 100,
            position: new THREE.Vector3(0, -0.05, 0),
            geometry: new THREE.CylinderGeometry(50, 50, 0.1, 32, 1),
            pivotGround: false
        })

        new CustomMeshObject({
            scene,
            name: 'stage',
            width: sizeStage,
            height: 0.1,
            depth: sizeStage,
            color: '#dddddd',
        })

        const floor = new CustomMeshObject({
            scene,
            name: 'floor',
            width: sizeRoom,
            height: thickRoom,
            depth: sizeRoom,
            color: config.color,
        })

        const wallR = new CustomMeshObject({
            scene,
            name: 'wallR',
            width: sizeRoom,
            height: sizeRoom,
            depth: thickRoom,
            position: new THREE.Vector3(0, 0, (sizeRoom + thickRoom) / 2),
            color: config.color,
        })

        const wallL = new CustomMeshObject({
            scene,
            name: 'wallL',
            width: thickRoom,
            height: sizeRoom,
            depth: sizeRoom,
            position: new THREE.Vector3((sizeRoom + thickRoom) / 2, 0, 0),
            color: config.color,
        })

        new Poster({
            scene,
            name: 'guide',
            geometry: new THREE.PlaneGeometry(2.0, 1.0),
            material: new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('guide.png'),
                transparent: true,
            }),
            position: new THREE.Vector3(-0.5, 0, -0.5),
            rotation: new THREE.Euler(-Math.PI / 2, 0, -Math.PI * 3/4),
            color: '#ffffff',
        })

        // Objects - Items //

        const refPosGround = floor.height;
        const refPosWallR = wallR.position.z - wallR.depth/2;
        const refPosWallL = wallL.position.x - wallL.width/2;

        const board = new GLTFMeshObject({
            scene,
            name: 'board',
            loader: gltfLoader,
            source: 'glb/board.glb',
            color: '#dbbd76',
            refPosition: new THREE.Vector3(0, floor.height, refPosWallR),
            pivotGround: false,
            position: new THREE.Vector3(0, 2.4, 0),
            rotation: new THREE.Euler(0, Math.PI, 0),
            scale: new THREE.Vector3(1.5, 1.5, 1.5),
        })

        const table = new GLTFMeshObject({
            scene,
            name: 'table',
            loader: gltfLoader,
            source: 'glb/table.glb',
            color: '#1c1f24',
            refPosition: new THREE.Vector3(refPosWallL, refPosGround, 0),
            position: new THREE.Vector3(-0.8, 0, 0),
            rotation: new THREE.Euler(0, -Math.PI, 0),
            scale: new THREE.Vector3(2, 1.5, 2),
        })

        new GLTFMeshObject({
            scene,
            name: 'iconMesh',
            loader: gltfLoader,
            source: config.iconMeshUrl,
            scale: new THREE.Vector3(1, 1, 1),
            position: new THREE.Vector3(2, 1, 2),
            rotation: new THREE.Euler(-Math.PI/2, 0, 0),
            normal: true,
        })

        new Lamp({
            scene,
            name: 'lampL',
            loader: gltfLoader,
            source: 'glb/lamp.glb',
            refPosition: new THREE.Vector3(refPosWallL, refPosGround, 0),
            position: new THREE.Vector3(-0.5, 0, -2.4),
            scale: new THREE.Vector3(1.5, 1.5, 1.5),
        })

        new Lamp({
            scene,
            name: 'lampR',
            loader: gltfLoader,
            source: 'glb/lamp.glb',
            refPosition: new THREE.Vector3(0, refPosGround, refPosWallR),
            position: new THREE.Vector3(-2.4, 0, -0.5),
            scale: new THREE.Vector3(1.5, 1.5, 1.5),
        })
        
        config.links.map((link, i) => {
            const position = (i < 3)
                ? new THREE.Vector3(0.8 - i * 0.8, 0.4, -0.1)
                : new THREE.Vector3(0.4 - (i-3) * 0.8, -0.4, -0.1)

            return new LinkPost({
                scene,
                name: `post_${i}`,
                loader: gltfLoader,
                source: 'glb/post.glb',
                color: '#edea45',
                refPosition: board.position,
                pivotGround: false,
                position: position,
                rotation: new THREE.Euler(Math.PI/2, 0, Math.PI),
                href: link,
            })
        })

        const cushions = config.stacks.map((stack, i) => {
            const position = new THREE.Vector3(Math.random() * 0.2 - 0.5, 2 + Math.random() * 0.2, 0.3 * i - 1.0)
            const rotation = new THREE.Euler(Math.random() * Math.PI/3, Math.random() * Math.PI/3, Math.random() * Math.PI/3);

            return new Cushion({
                scene,
                slug: stack,
                name: `cushion_${stack}`,
                loader: gltfLoader,
                source: 'glb/cushion.glb',
                pivotGround: false,
                refPosition: table.position,
                position: position,
                rotation: rotation,
            })
        })

        // Text //

        new TextPlane({
            scene,
            name: 'labelStack',
            text: '[기술 스택]',
            fontSize: 44,
            refPosition: table.position,
            position: new THREE.Vector3(0.7, 2, 0),
            rotation: new THREE.Euler(0, -Math.PI/2, 0),
        })

        new TextPlane({
            scene,
            name: 'labelLink',
            text: '[참고 링크]',
            fontSize: 44,
            refPosition: board.position,
            position: new THREE.Vector3(0, 0.9, -0.2),
            rotation: new THREE.Euler(0, Math.PI, 0),
        })

        // Agent //
        const player = new Player({
            scene,
            name: 'you',
            mass: 10,
            width: 1,
            height: 2,
            depth: 1,
            position: new THREE.Vector3(-2.5, 2, -2.5),
            refPosition: new THREE.Vector3(0, floor.height, 0),
        });
        controller.agent = player;

        // console.table(scene.children.map(obj => ({
        //   name: obj.name,
        //   type: obj.type,
        //   children: obj.children.length
        // })));

        // Update Loop //
        const update = () => {
            delta = clock.getDelta();
            
            cannon.update(delta);

            if (isDebugging) cannonDebugger.update();

            player.update();
            
            controller.move();

            controller.rotate(camera);
            
            // called per frame due to the computing bottleneck
            controller.getHoverIntersects(cushions.map(e => e.mesh), camera);

            renderer.render(scene, camera);

            renderer.setAnimationLoop(update);
        }
        
        update();

        // Events //
        const resizeHandler = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        const clickHandler = () => {
            // if isEdit is not called from useMyStore at here, but use the early one,
            // it will never be updated
            if (useMyStore.getState().isEdit) return;

            canvas.requestPointerLock();
            
            if(document.pointerLockElement === canvas){
                controller.getClickIntersects("clicked", scene.children, camera, player.name);
            }
        }

        const pointerlockchangeHandler = () => {
            if(document.pointerLockElement === canvas){
                useMyStore.getState().setIsGameMode(true);
                document.addEventListener('mousemove', controller.updateMouse);
                controller.hoverRaf = true;
                //controller.getHoverIntersects(cushions.map(e => e.mesh), camera, player.name);
            } else {
                useMyStore.getState().setIsGameMode(false);
                document.removeEventListener('mousemove', controller.updateMouse);
                controller.hoverRaf = false;
                //controller.removeHoverIntersects();
            }
        }

        window.addEventListener('resize', resizeHandler);
        window.addEventListener('click', clickHandler);
        document.addEventListener('pointerlockchange', pointerlockchangeHandler);

        return (() => {
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('click', clickHandler);
            document.removeEventListener('pointerlockchange', pointerlockchangeHandler);
            renderer.setAnimationLoop(null);
        })

    }, [config])

    return null;
}

export default Room;