// アンビエントライト

let scene = new THREE.Scene();
let cameracamera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
let renderer = new THREE.WebGLRenderer();

const init = () => {
    const initStats = () => {
        const stats = new Stats();
        stats.setMode(0); // 0: fps 1: ms

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById('Stats-output').appendChild(stats.domElement);

        return stats;
    }
    const stats = initStats();
    
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const axes = new THREE.AxesHelper(20);
    scene.add(axes);

    const planeGeometry = new THREE.PlaneGeometry(60, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xcccccc
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;

    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff0000,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;

    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x7777ff,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;

    scene.add(sphere);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight)

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    let step = 0;
    
    let pointColor = "#0c0c0c";
    let pointPositionX = 10;
    let pointPositionY = 10;
    let pointPositionZ = 10;
    let pointIntensity = 1.0;
    let pointDistance = 100;
    let pointDecay = 1.0;

    const pointLight = new THREE.AmbientLight(pointColor);
    pointLight.position.set(pointPositionX, pointPositionY, pointPositionZ);
    pointLight.intensity = pointIntensity;
    pointLight.distance = pointDistance;
    pointLight.decay = pointDecay;
    scene.add(pointLight);

    class Controls {
        constructor() {
            this.pointColor = pointColor;
            this.pointPositionX = pointPositionX;
            this.pointPositionY = pointPositionY;
            this.pointPositionZ = pointPositionZ;
            this.pointIntensity = pointIntensity;
            this.pointDistance = pointDistance;
            this.pointDecay = pointDecay;
        }
    }
    const controls = new Controls();
    const gui = new dat.GUI();
    gui.addColor(controls, 'pointColor').onChange((e) => {
        pointLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'pointPositionX', -20., 20.).onChange((e) => {
        pointLight.position.x = e;
    });
    gui.add(controls, 'pointPositionY', -20., 20.).onChange((e) => {
        pointLight.position.y = e;
    });
    gui.add(controls, 'pointPositionZ', -20., 20.).onChange((e) => {
        pointLight.position.z = e;
    });
    gui.add(controls, 'pointIntensity', 0, 10.0).onChange((e) => {
        pointLight.intensity = e;
    });
    gui.add(controls, 'pointDistance', 0, 200).onChange((e) => {
        pointLight.distance = e;
    });
    gui.add(controls, 'pointDecay', 0.1, 10.0).onChange((e) => {
        pointLight.decay = e;
        console.log(pointLight);
    });

    const renderScene = () => {
        stats.update();
        cube.rotation.x += .03;
        cube.rotation.y += .03;
        cube.rotation.z += .03;
        step += .03;
        sphere.position.x = 20 + (10 * Math.cos(step));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
        
        // モダンなブラウザ上でのアニメーションはこっちを使おう
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
    renderScene();
}

const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

window.addEventListener('resize', onResize, false);