import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container').appendChild(renderer.domElement);

// Sphere Geometry
const geometry = new THREE.SphereGeometry(1, 64, 64);

// Material for the sphere - Glowing effect using emissive property
const material = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    emissive: 0x0033ff,
    emissiveIntensity: 2,
    roughness: 0.1,
    metalness: 0.5,
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Outer glow effect - a slightly larger sphere with additive blending
const glowGeometry = new THREE.SphereGeometry(1.2, 64, 64);
const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        viewVector: { type: "v3", value: camera.position }
    },
    vertexShader: `
        varying float intensity;
        void main() {
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * vec3(0.0, 0.0, 1.0) );
            intensity = pow( 0.6 - dot(vNormal, vNormel), 2.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        varying float intensity;
        void main() {
            vec3 glow = vec3(0.0, 0.5, 1.0) * intensity;
            gl_FragColor = vec4( glow, 1.0 );
        }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
});

const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glowMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

camera.position.z = 3;

// Mouse responsiveness
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Continuous spin
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.002;

    // Mouse response
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
    
    // Sync glow mesh rotation
    glowMesh.rotation.x = sphere.rotation.x;
    glowMesh.rotation.y = sphere.rotation.y;

    renderer.render(scene, camera);
}

animate();
