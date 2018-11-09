let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 0.1, 1000
);
let renderer = new THREE.WebGLRenderer();

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
    renderer.setClearColor(new THREE.Color(0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;
    
    const createSprites = () => {
        const material = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            color: 0xffffff
        });
        const geom = new THREE.Geometry();
        for (let i of range2(-5, 5)) {
            console.log(i);
            for (let j of range2(-5, 5)) {
                const particle = new THREE.Vector3(i * 10, j * 10, 0);
                geom.vertices.push(particle);
                geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
            }
        }

        const cloud = new THREE.Points(geom, material);
        scene.add(cloud);
    }

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    const renderScene = () => {
        stats.update();
        
        // モダンなブラウザ上でのアニメーションはこっちを使おう
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    createSprites();
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
