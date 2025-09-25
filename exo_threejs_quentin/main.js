import * as THREE from 'three';

// Configuration de base
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Création des particules
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 15000; // Plus de particules
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);
const colorArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 20; // Zone plus large
    posArray[i + 1] = (Math.random() - 0.5) * 20;
    posArray[i + 2] = (Math.random() - 0.5) * 20;

    // Couleurs plus vives
    colorArray[i] = Math.random() * 0.5 + 0.5; // Rouge plus vif
    colorArray[i + 1] = Math.random() * 0.5 + 0.5; // Vert plus vif
    colorArray[i + 2] = Math.random() * 0.5 + 0.5; // Bleu plus vif
}

for (let i = 0; i < particlesCount; i++) {
    scaleArray[i] = Math.random() * 0.5 + 0.5; // Tailles plus variées
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.04, // Particules plus grandes
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Position de la caméra
camera.position.z = 7;

// Variables pour l'animation
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let time = 0;

// Gestion des événements de la souris avec plus de réactivité
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 50; // Plus réactif
    mouseY = (event.clientY - window.innerHeight / 2) / 50;
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    time += 0.015; // Animation plus rapide

    // Animation fluide de la souris avec plus de réactivité
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;

    // Rotation et mouvement des particules plus dynamiques
    particlesMesh.rotation.y += 0.002;
    particlesMesh.rotation.x += 0.001;

    // Déformation basée sur la position de la souris plus prononcée
    particlesMesh.rotation.x += targetY * 0.0005;
    particlesMesh.rotation.y += targetX * 0.0005;

    // Animation des particules individuelles
    const positions = particlesGeometry.attributes.position.array;
    const scales = particlesGeometry.attributes.scale.array;
    const colors = particlesGeometry.attributes.color.array;

    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Effet de vague plus prononcé
        positions[i] = x + Math.sin(time + y + z) * 0.03;
        positions[i + 1] = y + Math.cos(time + x + z) * 0.03;
        positions[i + 2] = z + Math.sin(time + x + y) * 0.03;

        // Animation de l'échelle plus dynamique
        scales[i / 3] = 1 + Math.sin(time + x + y + z) * 0.4;

        // Animation des couleurs plus vives
        colors[i] = 0.5 + Math.sin(time + x) * 0.5;
        colors[i + 1] = 0.5 + Math.cos(time + y) * 0.5;
        colors[i + 2] = 0.5 + Math.sin(time + z) * 0.5;
    }

    particlesGeometry.attributes.position.needsUpdate = true;
    particlesGeometry.attributes.scale.needsUpdate = true;
    particlesGeometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Démarrage de l'animation
animate(); 