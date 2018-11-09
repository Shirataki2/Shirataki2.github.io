// テキスト

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
let renderer = new THREE.WebGLRenderer();

let fonts = {};

const loadFonts = () => {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load("../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json", (helvetiker) => {
        fonts['helvetiker'] = helvetiker;
        fontLoader.load("../../node_modules/three/examples/fonts/optimer_regular.typeface.json", (optimer) => {
            fonts['optimer'] = optimer;
            init();
        });
    });
}

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
    renderer.setClearColor(new THREE.Color(0x7f7f7f));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    camera.position.x = 100;
    camera.position.y = 300;
    camera.position.z = 600;
    camera.lookAt(new THREE.Vector3(400, 0, -300));

    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(25, 23, 15);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight();
    dirLight2.position.set(-25, 23, 15);
    scene.add(dirLight2);

    
    let text1;
    let text2;

    createMesh = (geom) => {
        const meshMaterial = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            color: 0xff6666,
            shininess: 100
        });
        const plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
        return plane;
    }
    class Controls{
        constructor(){
            this.size = 90;
            this.height = 90;
            this.bevelThickness = 2;
            this.bevelSize = 0.5;
            this.bevelEnabled = true;
            this.bevelSegments = 3;
            this.bevelEnabled = true;
            this.curveSegments = 12;
            this.steps = 1;
            this.font = "helvetiker";
            this.weight = "normal";
        }
        asGeom(){
            scene.remove(text1);
            scene.remove(text2);
            const options = {
                size: controls.size,
                height: controls.height,
                weight: controls.weight,
                font: fonts[controls.font],
                bevelThickness: controls.bevelThickness,
                bevelSize: controls.bevelSize,
                bevelSegments: controls.bevelSegments,
                bevelEnabled: controls.bevelEnabled,
                curveSegments: controls.curveSegments,
                steps: controls.steps
            };
            text1 = createMesh(new THREE.TextGeometry("Learning", options));
            text1.position.z = -100;
            text1.position.y = 100;
            scene.add(text1);
            text2 = createMesh(new THREE.TextGeometry("Three.js", options));
            scene.add(text2);
        }
    };

    const controls = new Controls();
    controls.asGeom();
    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 200).onChange(controls.asGeom);
    gui.add(controls, 'height', 0, 200).onChange(controls.asGeom);
    gui.add(controls, 'font', ['optimer', 'helvetiker']).onChange(controls.asGeom);
    gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);
    gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);
    gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);
    gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);
    gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);
    gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);
    
    let ambiColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);
    
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    const renderScene = () => {
        stats.update();
        
        // モダンなブラウザ上でのアニメーションはこっちを使おう
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
    renderScene();
}

const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    console.log(renderer.getSize());
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = loadFonts;

window.addEventListener('resize', onResize, false);
