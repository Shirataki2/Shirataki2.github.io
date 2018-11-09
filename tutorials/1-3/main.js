// アニメーションの追加
// デバッグツールの追加
// GUIコントローラの追加
// Windowサイズ変更時のイベントリスナーの登録

let scene= new THREE.Scene();
let cameracamera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
let renderer = new THREE.WebGLRenderer();

const init = () => {
    const initStats = () => {
        const stats = new Stats();
        stats.setMode(0); // 0: fps 1:] ms

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
    const planeMaterial = new THREE.MeshStandardMaterial({
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
    
    // GUIコントロールに登録する変数の登録
    class Controls {
        constructor() {
            this.rotationSpeed = .02;
            this.bouncingSpeed = .03;
        }
    }
    const controls = new Controls();
    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, .5);
    gui.add(controls, 'bouncingSpeed', 0, .5);

    const renderScene = () => {
        // 更新処理
        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
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