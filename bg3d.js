// Ambient 3D background: floating wireframe shapes + a sparse particle field.
// Purely decorative — renders behind .bg-blobs and all page content, and
// follows the same dark-mode / reduced-motion conventions as script.js.
(() => {
  const canvas = document.getElementById("bg3d-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  try {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const getShapeColor = () =>
      document.body.classList.contains("dark") ? 0xcfcfcf : 0x3a3a3a;

    // Floating wireframe shapes, roughly echoing the blob positions.
    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(9, 0), pos: [-16, 8, -10] },
      { geo: new THREE.OctahedronGeometry(7, 0), pos: [15, -6, -18] },
      { geo: new THREE.TetrahedronGeometry(6, 0), pos: [8, 12, -5] },
      { geo: new THREE.IcosahedronGeometry(5, 0), pos: [-12, -10, -14] },
    ];

    const shapes = shapeDefs.map(({ geo, pos }) => {
      const material = new THREE.MeshBasicMaterial({
        color: getShapeColor(),
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(...pos);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      return {
        mesh,
        spin: {
          x: (Math.random() - 0.5) * 0.0015,
          y: (Math.random() - 0.5) * 0.0015,
        },
      };
    });

    // Sparse particle field for depth.
    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: getShapeColor(),
      size: 0.6,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particles);

    // Faint tilted grid plane, further back than the shapes, for depth.
    const gridWidth = 140;
    const gridHeight = 90;
    const gridDivisionsX = 14;
    const gridDivisionsY = 9;
    const halfW = gridWidth / 2;
    const halfH = gridHeight / 2;
    const gridPositions = [];
    for (let i = 0; i <= gridDivisionsX; i++) {
      const x = -halfW + (gridWidth / gridDivisionsX) * i;
      gridPositions.push(x, -halfH, 0, x, halfH, 0);
    }
    for (let j = 0; j <= gridDivisionsY; j++) {
      const y = -halfH + (gridHeight / gridDivisionsY) * j;
      gridPositions.push(-halfW, y, 0, halfW, y, 0);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: getShapeColor(),
      transparent: true,
      opacity: 0.12,
    });
    const gridLines = new THREE.LineSegments(gridGeo, gridMaterial);
    gridLines.position.z = -35;
    gridLines.rotation.x = -0.2;
    gridLines.rotation.z = 0.03;
    scene.add(gridLines);

    const updateColors = () => {
      const color = getShapeColor();
      shapes.forEach(({ mesh }) => mesh.material.color.setHex(color));
      particleMaterial.color.setHex(color);
      gridMaterial.color.setHex(color);
      if (prefersReducedMotion) renderer.render(scene, camera);
    };

    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", updateColors);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) renderer.render(scene, camera);
    });

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
      return;
    }

    const animate = () => {
      shapes.forEach(({ mesh, spin }) => {
        mesh.rotation.x += spin.x;
        mesh.rotation.y += spin.y;
      });
      particles.rotation.y += 0.0004;
      gridLines.rotation.z += 0.00015;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  } catch (err) {
    canvas.style.display = "none";
  }
})();
