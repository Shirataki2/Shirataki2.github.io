// Blenderオブジェクトの読み込み

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
let renderer = new THREE.WebGLRenderer();
let earth;

const range = n => [...Array(n).keys()];
const range2 = (st, ed) => range(ed - st).map((v) => v + st);

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
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    camera.position.x = 20;
    camera.position.y = 20;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(0,0,0));

    const loader = new THREE.GLTFLoader();
    loader.load('../../assets/Earth.blend3.glb', (f) => {
        scene.add(f.scene);
        f.scene.children.forEach((e) => {
            if (e.name==='Earth') {
                earth = e;
            }
        })

    }, (xhr) => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, (e) => {
        console.log(e);
    });

    let ambiColor = "#343434";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    ambientLight.intensity = 2.7;
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(25, 23, 15);
    dirLight.intensity = 3.9;
    scene.add(dirLight);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    const renderScene = () => {
        stats.update();
        if (earth != undefined) {
           scene.rotateY(.008);
        }
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

window.onload = init;

window.addEventListener('resize', onResize, false);
