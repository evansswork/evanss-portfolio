// Hero 3D "playground": bentuk-bentuk toon berwarna yang melayang,
// menghindar dari kursor, bisa di-drag untuk memutar, dan di-klik untuk "pop".
// Ringan: ±7 mesh, satu directional light, tanpa post-processing,
// berhenti render saat hero tidak terlihat.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3, Plane, Raycaster,
  Color, DataTexture, RedFormat, NearestFilter, HemisphereLight, DirectionalLight,
  MeshToonMaterial, MeshBasicMaterial, BackSide, TorusKnotGeometry, IcosahedronGeometry,
  CapsuleGeometry, TorusGeometry, SphereGeometry, ConeGeometry, ExtrudeGeometry, Shape, BoxGeometry,
} from 'three';
import gsap from 'gsap';

const PALETTE = {
  pink: '#ff5c8a', blue: '#3d6bff', green: '#35d07f', orange: '#ff8a3d', paper: '#fffcf5', yellow: '#ffe066', ink: '#16140f',
};

function starShape(outer = 1, inner = 0.45, points = 5) {
  const s = new Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export function createHeroScene(canvas, { confetti: confettiOn = true } = {}) {
  const isMobile = window.matchMedia('(max-width: 720px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 0, 11);

  scene.add(new HemisphereLight(0xffffff, 0xb8a060, 1.1));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(4, 6, 7);
  scene.add(sun);

  // 3-step toon gradient
  const grad = new DataTexture(new Uint8Array([70, 150, 255]), 3, 1, RedFormat);
  grad.minFilter = grad.magFilter = NearestFilter;
  grad.needsUpdate = true;

  const group = new Group();
  scene.add(group);

  // ---- definisi bentuk: [geometry, warna, posisi awal, ukuran]
  const defs = [
    [new TorusKnotGeometry(0.62, 0.22, 120, 16), PALETTE.pink, [0.2, 1.3, 0.2], 1],
    [new IcosahedronGeometry(0.85, 0), PALETTE.blue, [2.2, 0.3, -0.6], 1],
    [new CapsuleGeometry(0.42, 0.9, 8, 18), PALETTE.green, [-1.4, -0.3, 0.4], 1],
    [new TorusGeometry(0.62, 0.26, 18, 48), PALETTE.orange, [1.1, -1.6, 0.3], 1],
    [new SphereGeometry(0.62, 32, 24), PALETTE.paper, [-0.6, 2.4, -0.8], 1],
    [new ExtrudeGeometry(starShape(0.8, 0.38), { depth: 0.35, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2 }), PALETTE.yellow, [2.1, 2.0, 0.1], 1],
    [new ConeGeometry(0.6, 1.2, 5), PALETTE.blue, [-1.9, 1.6, -0.3], 0.85],
  ];
  const shapes = [];
  defs.slice(0, isMobile ? 5 : defs.length).forEach(([geo, color, [x, y, z], s]) => {
    const mat = new MeshToonMaterial({ color: new Color(color), gradientMap: grad });
    if (geo.type === 'IcosahedronGeometry' || geo.type === 'ConeGeometry') mat.flatShading = true;
    const mesh = new Mesh(geo, mat);
    const outline = new Mesh(geo, new MeshBasicMaterial({ color: PALETTE.ink, side: BackSide }));
    outline.scale.setScalar(1.075);
    mesh.add(outline);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(0); // intro akan membesarkan
    mesh.userData = {
      base: s,
      home: new Vector3(x, y, z),
      vel: new Vector3(),
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.5,
      spin: new Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3),
    };
    group.add(mesh);
    shapes.push(mesh);
  });

  // ---- layout
  // L = posisi normal di hero; focus (0..1) menarik semua bentuk ke tengah layar
  // (dipakai opening 'zoom' supaya bentuk terlihat menembus huruf).
  const L = { x: 0, homeY: 0, scale: 1, focusScale: 1 };
  const focus = { value: 0 };
  const lerp = (a, b, t) => a + (b - a) * t;
  const layout = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    const stacked = w < 720 || (w < 1100 && h > w * 1.1); // HP & tablet portrait: teks di atas, bentuk di bawah
    L.homeY = stacked ? -3.1 : -0.1;
    L.x = stacked ? 0.5 : Math.min(2.5, w / 640 + 0.3);
    L.scale = stacked ? (w < 720 ? 0.58 : 0.7) : Math.min(0.85, w / 1800 + 0.4);
    L.focusScale = stacked ? (w < 720 ? 0.62 : 0.8) : Math.min(1.05, w / 1500 + 0.2);
  };
  layout();
  window.addEventListener('resize', layout);

  // ---- interaksi: hover/repel, drag rotate, click pop
  const raycaster = new Raycaster();
  const ndc = new Vector2(-10, -10);
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const mouseWorld = new Vector3(99, 99, 0);
  let hasMouse = false;
  let dragging = false, moved = 0, lastX = 0, lastY = 0;
  const rotVel = new Vector2();
  const rotTarget = new Vector2();
  let hovered = null;
  let scrollP = 0;

  const setNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  };
  const emitHover = (v) => {
    if (v === !!hovered) return;
    canvas.dispatchEvent(new CustomEvent('shapehover', { detail: v }));
  };

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
  });
  window.addEventListener('pointermove', (e) => {
    setNdc(e);
    hasMouse = e.pointerType !== 'touch';
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      rotVel.x += dy * 0.0035;
      rotVel.y += dx * 0.0045;
      lastX = e.clientX; lastY = e.clientY;
    }
  }, { passive: true });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6 && e) {
      setNdc(e);
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(shapes, true)[0];
      if (hit) pop(hit.object.parent === group ? hit.object : hit.object.parent);
    }
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', () => (dragging = false));
  window.addEventListener('pointerup', (e) => { if (dragging && e.target !== canvas) dragging = false; });

  // ---- konfeti kecil saat pop (pool, tanpa alokasi berulang)
  const confettiGeo = new BoxGeometry(0.16, 0.16, 0.04);
  const confettiMats = [PALETTE.pink, PALETTE.blue, PALETTE.green, PALETTE.orange, PALETTE.paper, PALETTE.ink].map((c) => new MeshBasicMaterial({ color: c }));
  const confetti = [];
  for (let i = 0; i < 48; i++) {
    const c = new Mesh(confettiGeo, confettiMats[i % confettiMats.length]);
    c.visible = false;
    c.userData = { vel: new Vector3(), life: 0, spin: new Vector3() };
    group.add(c);
    confetti.push(c);
  }
  function burst(at, n = 14) {
    let spawned = 0;
    for (const c of confetti) {
      if (c.visible) continue;
      c.visible = true;
      c.position.copy(at);
      c.userData.life = 1;
      c.userData.vel.set((Math.random() - 0.5) * 0.22, Math.random() * 0.2 + 0.08, (Math.random() - 0.5) * 0.22);
      c.userData.spin.set(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);
      c.scale.setScalar(0.7 + Math.random() * 0.8);
      if (++spawned >= n) break;
    }
  }
  const partyAll = () => shapes.forEach((m, i) => gsap.delayedCall(i * 0.07, () => pop(m)));
  canvas.addEventListener('dblclick', partyAll);

  function pop(mesh) {
    const d = mesh.userData;
    if (confettiOn) burst(mesh.position);
    canvas.dispatchEvent(new CustomEvent('shapepop')); // didengar oleh fitur suara
    gsap.killTweensOf([mesh.scale, mesh.rotation]);
    gsap.timeline()
      .to(mesh.scale, { x: d.base * 1.55, y: d.base * 1.55, z: d.base * 1.55, duration: 0.18, ease: 'power2.out' })
      .to(mesh.scale, { x: d.base, y: d.base, z: d.base, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, x: mesh.rotation.x + Math.PI, duration: 1.1, ease: 'power3.out' });
    d.vel.add(new Vector3((Math.random() - 0.5) * 0.24, 0.18, (Math.random() - 0.5) * 0.16));
    // tetangga ikut terdorong
    shapes.forEach((o) => {
      if (o === mesh) return;
      const dir = o.position.clone().sub(mesh.position);
      const dist = dir.length();
      if (dist < 3) o.userData.vel.add(dir.normalize().multiplyScalar((3 - dist) * 0.05));
    });
  }

  // ---- loop
  // Jam animasi (THREE.Clock sudah deprecated). elapsed bertambah per frame, jadi tidak melompat setelah tab disembunyikan.
  const clock = {
    last: 0,
    elapsed: 0,
    tick() { const now = performance.now(); const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 1 / 60; this.last = now; this.elapsed += dt; return dt; },
    resume() { this.last = 0; },
  };
  let running = true, raf = 0;
  const tmp = new Vector3();
  const invQ = group.quaternion.clone();

  const tick = () => {
    if (!running) return;
    const dt = clock.tick();
    const t = clock.elapsed;

    // rotasi group dari drag + inersia
    rotTarget.add(rotVel);
    rotVel.multiplyScalar(0.9);
    rotTarget.x = Math.max(-0.6, Math.min(0.6, rotTarget.x));
    if (!dragging) {
      // pelan-pelan kembali menghadap depan setelah diputar
      const k = Math.round(rotTarget.y / (Math.PI * 2)) * Math.PI * 2;
      rotTarget.y += (k - rotTarget.y) * 0.012;
      rotTarget.x += (0 - rotTarget.x) * 0.02;
    }
    group.rotation.x += (rotTarget.x + scrollP * 0.5 - group.rotation.x) * 0.1;
    group.rotation.y += (rotTarget.y + (hasMouse ? ndc.x * 0.15 : 0) - group.rotation.y) * 0.08;
    const f = focus.value;
    group.position.x = lerp(L.x, 0, f);
    group.scale.setScalar(lerp(L.scale, L.focusScale, f));
    group.position.y += (lerp(L.homeY, 0.15, f) + scrollP * 4 - group.position.y) * (f > 0.001 ? 0.2 : 0.08);

    // titik kursor di dunia (bidang z = 0)
    if (hasMouse && !reduced) {
      raycaster.setFromCamera(ndc, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);
      const hit = dragging ? null : raycaster.intersectObjects(shapes, true)[0];
      const newHover = hit ? (hit.object.parent === group ? hit.object : hit.object.parent) : null;
      emitHover(!!newHover);
      hovered = newHover;
    }
    invQ.copy(group.quaternion).invert();

    shapes.forEach((m) => {
      const d = m.userData;
      // melayang
      const floatY = Math.sin(t * d.speed + d.phase) * 0.18;
      const floatX = Math.cos(t * d.speed * 0.7 + d.phase) * 0.1;
      // dorongan kursor
      if (hasMouse && !reduced) {
        m.getWorldPosition(tmp);
        const dir = tmp.sub(mouseWorld); dir.z = 0;
        const dist = dir.length();
        if (dist < 2.4 && dist > 0.001) {
          dir.normalize().multiplyScalar((2.4 - dist) * 0.012).applyQuaternion(invQ);
          d.vel.add(dir);
        }
      }
      // pegas kembali ke home
      d.vel.addScaledVector(d.home.clone().sub(m.position), 0.02);
      d.vel.multiplyScalar(0.9);
      m.position.add(d.vel);
      m.position.x += floatX * 0.02;
      m.position.y += floatY * 0.02;
      m.rotation.x += d.spin.x * dt;
      m.rotation.y += d.spin.y * dt;
      m.rotation.z += d.spin.z * dt;
    });

    // konfeti: gravitasi + memudar
    for (const c of confetti) {
      if (!c.visible) continue;
      const u = c.userData;
      u.vel.y -= 0.012;
      u.vel.multiplyScalar(0.97);
      c.position.add(u.vel);
      c.rotation.x += u.spin.x; c.rotation.y += u.spin.y; c.rotation.z += u.spin.z;
      u.life -= dt * 0.9;
      c.scale.multiplyScalar(0.985);
      if (u.life <= 0) c.visible = false;
    }

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; clock.resume(); tick(); }
    else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);

  return {
    focus,
    // dipanggil sebelum opening: sembunyikan bentuk & atur fokus
    prepare({ focus: f = 0 } = {}) {
      shapes.forEach((m) => { gsap.killTweensOf(m.scale); m.scale.setScalar(0); });
      gsap.killTweensOf(focus);
      focus.value = f;
    },
    // bentuk muncul satu per satu (elastic)
    intro() {
      const tl = gsap.timeline();
      shapes.forEach((m, i) => {
        const s = m.userData.base;
        tl.fromTo(m.scale, { x: 0, y: 0, z: 0 }, { x: s, y: s, z: s, duration: 1.1, ease: 'elastic.out(1, 0.45)' }, i * 0.08);
      });
      return tl;
    },
    // lepas fokus: bentuk meluncur ke posisi normalnya di hero
    release(duration = 1.4) {
      return gsap.to(focus, { value: 0, duration, ease: 'power3.inOut' });
    },
    setScroll(p) { scrollP = p; },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', layout);
      shapes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      renderer.dispose();
    },
  };
}
