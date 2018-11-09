let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
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
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    camera.position.x = 0;
    camera.position.y = 80;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(-10,0,27));

    const points = gosper(4, 60);
    const lines = new THREE.Geometry();
    let colors = [];
    let i = 0;
    points.forEach((e) => {
        lines.vertices.push(new THREE.Vector3(e.x, e.z, e.y));
        colors[i] = new THREE.Color(0xffffff);
        colors[i].setHSL(e.x / 100 + .5, (e.y * 20) / 300, .8);
        i++;
    });

    lines.colors = colors;
    const material = new THREE.LineBasicMaterial({
        opacity: 1.0,
        linewidth: 1,
        vertexColors: THREE.VertexColors
    });
    const line = new THREE.Line(lines, material);
    scene.add(line);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight)

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    
    let ambiColor = "#0c0c0c";
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

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

window.onload = init;

window.addEventListener('resize', onResize, false);

const gosper = (a, b) => {
    let turtle = [0, 0, 0];
    let points = [];
    let count = 0;

    const rt = (x) => {
        turtle[2] += x;
    }
    
    const lt = (x) => {
        turtle[2] -= x;
    }

    const fd = (x) => {
        points.push({
            x: turtle[0],
            y: turtle[1],
            z: Math.sin(count) * 5
        });
        const dir = turtle[2] * (Math.PI / 180);
        turtle[0] += Math.cos(dir) * x;
        turtle[1] += Math.sin(dir) * x;
        points.push({
            x: turtle[0],
            y: turtle[1],
            z: Math.sin(count) * 5
        });
    }

    const rg = (st, ln, turtle) => {
        st--;
        ln /= 2.6457;
        if (st > 0) {
            rg(st, ln, turtle);
            rt(60);
            gl(st, ln, turtle);
            rt(120);
            gl(st, ln, turtle);
            lt(60);
            rg(st, ln, turtle);
            lt(120);
            rg(st, ln, turtle);
            rg(st, ln, turtle);
            lt(60);
            gl(st, ln, turtle);
            rt(60);
        }
        if (st == 0) {
            fd(ln);
            rt(60);
            fd(ln);
            rt(120);
            fd(ln);
            lt(60);
            fd(ln);
            lt(120);
            fd(ln);
            fd(ln);
            lt(60);
            fd(ln);
            rt(60);
        }
    }
    const gl = (st, ln, turtle) => {
        st--;
        ln /= 2.6457;
        if (st > 0) {
            lt(60);
            rg(st, ln, turtle);
            rt(60);
            gl(st, ln, turtle);
            gl(st, ln, turtle);
            rt(120);
            gl(st, ln, turtle);
            rt(60);
            rg(st, ln, turtle);
            lt(120);
            rg(st, ln, turtle);
            lt(60);
            gl(st, ln, turtle);
        }
        if (st == 0) {
            lt(60);
            fd(ln);
            rt(60);
            fd(ln);
            fd(ln);
            rt(120);
            fd(ln);
            rt(60);
            fd(ln);
            lt(120);
            fd(ln);
            lt(60);
            fd(ln);
        }
    }

    rg(a, b, turtle);

    return points;

}