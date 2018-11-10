// MMDモデルのロード

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
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    const effect = new THREE.OutlineEffect(renderer);

    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const modelPath = "./models/model/kizunaai.pmx";
    const motionPath = "./vmds/dance.vmd";
    const mmdLoader = new THREE.MMDLoader();
    const mmdHelper = new THREE.MMDAnimationHelper({
        afterglow: 2.0
    });
    const gridHelper = new THREE.PolarGridHelper( 30, 10 );
	gridHelper.position.y = - 10;
	scene.add( gridHelper );
    let ikHelper, physHelper;

    mmdLoader.loadWithAnimation(
        modelPath,
        motionPath,
        (o) => {
            m = o.mesh;
            console.log(m);
            m.position.set(0, -10, 0);
            m.rotation.set(0, 0, 0);
            scene.add(m);
            mmdHelper.add(m, {
                animation: o.animation,
                physics: true
            });
            ikHelper = mmdHelper.objects.get(m).ikSolver.createHelper();
            ikHelper.visible = false;
            scene.add(ikHelper);
            physHelper = mmdHelper.objects.get(m).physics.createHelper();
            physHelper.visible = false;
            scene.add(physHelper);

        },
        (x) => {
            if (x.lengthComputable) {
                let per = x.loaded / x.total * 100;
                console.log(`${Math.round(per, 2)}% Loaded`);
            }
        },
        (e) => {
            console.log(e);
        }
    );

    camera.position.x = 30;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0,-10,0));
    let ambiColor = "#343434";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    ambientLight.intensity = .2;
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight();
    dirLight.position.set(25, 23, 15);
    dirLight.intensity = .8;
    scene.add(dirLight);
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    const trackballControls = new THREE.TrackballControls(camera);
    trackballControls.rotateSpeed = 2.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = .3;
    const clock = new THREE.Clock();
    const renderScene = () => {
        stats.update();
        
        let delta = clock.getDelta();
        trackballControls.update(delta);

        // モダンなブラウザ上でのアニメーションはこっちを使おう
        requestAnimationFrame(renderScene);
        mmdHelper.update(delta);
        effect.render(scene, camera);
        //composer.render(delta);
    }

    renderScene();
}

const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    console.log(renderer.getSize());
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload=init;

window.addEventListener('resize', onResize, false);
