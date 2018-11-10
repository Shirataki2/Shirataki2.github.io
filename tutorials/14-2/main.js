// MMDモデルのロード + カメラモーションと音楽同期

let isReady = false;
const yOffset = 2;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    135, window.innerWidth / window.innerHeight, 0.1, 5000
);
let  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    premultipliedAlpha: true
});
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
        30, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: true
    });

    scene.fog = new THREE.Fog(0xffffff, 25, 400);
    renderer.setClearAlpha(0);
    const effect = new THREE.OutlineEffect(renderer);

    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.shadowMap.enabled = true;

    const modelPath = "./models/model/kizunaai.pmx";
    const camPath = "./vmds/camera.vmd";
    const musPath = "./audios/music_2.mp3";
    const motionPath = "./vmds/dance.vmd";
    const mmdLoader = new THREE.MMDLoader();
    const mmdHelper = new THREE.MMDAnimationHelper({
        afterglow: 2.0
    });
    let ikHelper, physHelper;
    let listener;

    const loader = new THREE.GLTFLoader();
    
    loader.load('./models/stage/stage.glb', (f) => {
        scene.add(f.scene);
        f.scene.receiveShadow = true;
        f.scene.castShadow = true;
        f.scene.position.set(0, yOffset, -80);
        f.scene.rotation.set(0, 0, 0);
        f.scene.scale.set(3, 3, 3);
        f.scene.children.forEach((o) => {
            if (o.name.slice(0, 4) === "Lamp") {
                const pos = o.position;
                const lamp = new THREE.PointLight(0x393910, .4, 200, 1);
                lamp.position.set(3 * pos.x, 3 * (pos.y )+ yOffset, 3 * pos.z -80);
                //var pointLightHelper = new THREE.PointLightHelper( lamp, 10 );
                //scene.add( pointLightHelper );
                scene.add(lamp);
            }
        })
        }, (xhr) => {
        console.log("Stage " +( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }, (e) => {
        console.log(e);
        }
    );
    
    
    mmdLoader.loadWithAnimation(
        modelPath,
        motionPath,
        (o) => {
            const m = o.mesh;
            console.log(o);
            m.position.set(0, yOffset, 0);
            m.rotation.set(0, 0, 0);
            mmdHelper.add(m, {
                animation: o.animation,
                physics: true
            });
            mmdLoader.loadAnimation(
                camPath,
                camera,
                (camAnim) => {
                    mmdHelper.add(camera, {
                        animation: camAnim
                    });
                    new THREE.AudioLoader().load(
                        musPath,
                        (buf) => {
                            listener = new THREE.AudioListener();
                            const audio = new THREE.Audio(listener).setBuffer(buf);
                            listener.position.y = 10;
                            listener.position.x = -300;
                            mmdHelper.add(audio, {
                                delayTime: 1.6
                            });
                            scene.add(audio);
                            scene.add(m);
                            console.log(m);
                            m.material
                            ikHelper = mmdHelper.objects.get(m).ikSolver.createHelper();
                            ikHelper.visible = false;
                            scene.add(ikHelper);
                            physHelper = mmdHelper.objects.get(m).physics.createHelper();
                            physHelper.visible = false;
                            scene.add(physHelper);
                            isReady = 1;
                        }, null, null);
                }, null, null);
        },
        (x) => {
            if (x.lengthComputable) {
                let per = x.loaded / x.total * 100;
                console.log(`Ai-chan ${Math.round(per, 2)}% Loaded`);
            }
        },
        (e) => {
            console.log(e);
        }
    );

    const tloader = new THREE.TextureLoader();
    const starTexture = tloader.load('star.png');
    const starsGeometry = new THREE.Geometry();
    for (var i = 0; i < 100000; i++) {
        var star = new THREE.Vector3();
        
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloat(100, 6000);
        star.z = THREE.Math.randFloatSpread(2000);
        starsGeometry.vertices.push(star);
    }
    const starsMaterial = new THREE.PointsMaterial({
      map: starTexture,
      size: 5,
      transparent: true,
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);


    camera.position.x = 30;
    camera.position.y = 10;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0,yOffset,0));
    let ambiColor = "#ffa3a3";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    ambientLight.intensity = .4;
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(25, 23, 15);
    dirLight.lookAt(scene.position);
    dirLight.rotateX(0);
    dirLight.intensity = .6;
    scene.add(dirLight);
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    const trackballControls = new THREE.TrackballControls(camera);
    trackballControls.rotateSpeed = 2.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = .3;
    const clock = new THREE.Clock();

    const renderPass = new THREE.RenderPass(scene, camera);
    //const effectFilm = new THREE.ShaderPass(THREE.FocusShader);
    //const effectRGB = new THREE.ShaderPass(THREE.RGBShiftShader);
    //effectFilm.renderToScreen = true;
    const composer = new THREE.EffectComposer(renderer);

    composer.addPass(renderPass);
    //composer.addPass(effectFilm);


    const renderScene = () => {
        stats.update();
        
        let delta = clock.getDelta();
        //trackballControls.update(delta);

        // モダンなブラウザ上でのアニメーションはこっちを使おう
        requestAnimationFrame(renderScene);
        if (isReady) {
            
            listener.position.set(camera.position.x, camera.position.y, camera.position.z);
            mmdHelper.update(delta);

        }
        renderer.render(scene, camera);
        //effect.render(scene, camera);
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
