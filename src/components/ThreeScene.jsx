import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const particlesRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 6); // Better position to view the sphere
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true // Make the background transparent
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Sphere particles setup
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000; // More particles for sphere effect
        const posArray = new Float32Array(particlesCount * 3);
        const velocities = new Float32Array(particlesCount); // Array for individual velocities
        const sizes = new Float32Array(particlesCount); // Array for individual sizes
        const angles = new Float32Array(particlesCount); // Array for rotation angles

        for (let i = 0; i < particlesCount; i++) {
            // Create sphere distribution
            const radius = 2 + Math.random() * 1; // Random radius between 2 and 3
            const theta = Math.random() * Math.PI * 2; // Random angle around Y axis
            const phi = Math.random() * Math.PI; // Random angle from top to bottom

            // Convert spherical to cartesian coordinates
            posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
            posArray[i * 3 + 1] = radius * Math.cos(phi); // y
            posArray[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta); // z

            // Velocity for rotation
            velocities[i] = 0.01 + Math.random() * 0.02; // Rotation speed

            // Size - smaller, more uniform
            sizes[i] = 0.01 + Math.random() * 0.008; // Smaller size for sphere

            // Initial angle for each particle
            angles[i] = Math.random() * Math.PI * 2;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: 0xffffff, // Pure white
            transparent: true,
            opacity: 0.9, // Slightly more opaque for better visibility
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        particlesRef.current = particlesMesh;

        // Animation
        const animate = () => {
            if (particlesRef.current) {
                const positions = particlesRef.current.geometry.attributes.position.array;
                const time = Date.now() * 0.001;

                for (let i = 0; i < particlesCount; i++) {
                    // Update rotation angle
                    angles[i] += velocities[i];

                    // Calculate new position on sphere
                    const radius = 2 + Math.sin(time * 0.5 + i * 0.1) * 0.3; // Pulsing radius
                    const theta = angles[i];
                    const phi = (i / particlesCount) * Math.PI; // Distribute particles evenly

                    // Convert spherical to cartesian coordinates
                    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
                    positions[i * 3 + 1] = radius * Math.cos(phi); // y
                    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta); // z
                }

                particlesRef.current.geometry.attributes.position.needsUpdate = true;
            }

            controlsRef.current?.update();
            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 2 }} />;
};

export default ThreeScene; 