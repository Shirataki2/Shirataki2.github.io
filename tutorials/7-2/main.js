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

    camera.position.x = 20;
    camera.position.y = 40;
    camera.position.z = 110;
    camera.lookAt(new THREE.Vector3(0, 40, 0));
    
    const createPoints = (name, texture, size, transparent, opacity, sizeAttenuation, col, particleRange = 110) => {
        const geom = new THREE.Geometry();
        const color = new THREE.Color(col);
        color.setHSL(
            color.getHSL(color).h,
            color.getHSL(color).s,
            Math.random()
        );
        const material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            map: texture,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: sizeAttenuation,
            color: color
        });
        const p = particleRange;
        for (let i of range(240)) {
            const particle = new THREE.Vector3(
                Math.random() * p - p / 2,
                Math.random() * p * 1.5,
                Math.random() * p - p / 2
            );
            particle.velocityX = (Math.random() - .5) / 3;
            particle.velocityZ = (Math.random() - .5) / 3;
            particle.velocityY = (Math.random() + .5) / 5;
            geom.vertices.push(particle);
        }
        
        const system = new THREE.Points(geom, material);
        system.name = name;
        system.sortParticle = true;
        return system;
    }

    const createMultiPoints = (size, transparent, opacity, sizeAttenuation, color) => {
        const textureLoader = new THREE.TextureLoader();
        const texture1 = textureLoader.load("../../assets/particles/snowflake1.png");
        const texture2 = textureLoader.load("../../assets/particles/snowflake2.png");
        const texture3 = textureLoader.load("../../assets/particles/snowflake3.png");
        const texture4 = textureLoader.load("../../assets/particles/snowflake4.png");
        const texture5 = textureLoader.load("../../assets/particles/snowflake5.png");

        scene.add(createPoints("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system4", texture4, size, transparent, opacity, sizeAttenuation, color));
        scene.add(createPoints("system5", texture5, size, transparent, opacity, sizeAttenuation, color));
    }

    class Controls{
        constructor() {
            this.size = 10;
            this.transparent = true;
            this.opacity = .6;
            this.color = 0xffffff;
            this.sizeAttenuation = true;
        }
        redraw() {
            console.log(this.size);
            let toRemove = [];
            scene.children.forEach((child) => {
                if (child instanceof THREE.Points) {
                    toRemove.push(child)
                }
            });
            toRemove.forEach((child) => {
                scene.remove(child);
            });
            createMultiPoints(this.size, this.transparent, this.opacity, this.sizeAttenuation, this.color);
        }
    }
    const controls = new Controls();
    
    controls.redraw();

    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    const renderScene = () => {
        stats.update();
        
        scene.children.forEach((child) => {
            if (child instanceof THREE.Points) {
                const verts = child.geometry.vertices;
                verts.forEach((v) => {
                    v.x = v.x - v.velocityX;
                    v.y = v.y - v.velocityY;
                    v.z = v.z - v.velocityZ;
                    if (v.x <= -70 || v.x >= 70) v.velocityX = v.velocityX *-.3;
                    if (v.y <= -30) {
                        v.x = (Math.random() - .5) * 90;
                        v.z = (Math.random() - .5) * 90;
                        v.y = 110;
                    }
                    if (v.z <= -70 || v.z >= 70) v.velocityZ = v.velocityZ * -.3;
                });
                child.geometry.verticesNeedUpdate = true;
            }
        });

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
