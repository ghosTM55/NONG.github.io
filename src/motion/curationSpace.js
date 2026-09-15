import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Water } from "three/addons/objects/Water.js";
import { movementAxes, yawAfterDrag } from "./curationControls.js";

const root = document.querySelector("[data-space-root]");

if (root) {
  const canvas = root.querySelector("[data-space-canvas]");
  const artifacts = JSON.parse(root.dataset.artifacts || "[]");
  const markers = [...root.querySelectorAll("[data-space-marker]")];
  const locationEl = root.querySelector("[data-space-location]");
  const loader = root.querySelector("[data-space-loader]");
  const loadProgress = root.querySelector("[data-load-progress]");
  const loadBar = root.querySelector("[data-load-bar]");
  const intro = root.querySelector("[data-space-intro]");
  const hud = root.querySelector("[data-space-hud]");
  const detail = root.querySelector("[data-space-detail]");
  const scrim = root.querySelector("[data-detail-scrim]");
  const indexToggle = root.querySelector("[data-index-toggle]");
  const indexList = root.querySelector("[data-index-list]");

  const state = {
    started: false,
    detailOpen: false,
    dragging: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    yaw: 0.41,
    pitch: 0.015,
    targetYaw: 0.41,
    targetPitch: 0.015,
    transition: null,
    keys: new Set(),
    moveButtons: new Set(),
    selected: 0,
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    root.dataset.webgl = "unavailable";
    loader?.remove();
  }

  if (renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb9c2c3);
    scene.fog = new THREE.Fog(0xb9c2c3, 42, 95);

    const camera = new THREE.PerspectiveCamera(58, 1, 0.08, 120);
    camera.position.set(7.8, 1.68, 11.3);
    camera.rotation.order = "YXZ";

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const assetManager = new THREE.LoadingManager();
    assetManager.onProgress = (_url, loaded, total) => {
      const progress = Math.round((loaded / total) * 100);
      if (loadProgress) loadProgress.textContent = String(progress).padStart(2, "0");
      if (loadBar) loadBar.style.transform = `scaleX(${progress / 100})`;
    };
    assetManager.onLoad = () => window.setTimeout(() => {
      root.dataset.state = "ready";
      loader?.setAttribute("aria-hidden", "true");
    }, 260);
    const textureLoader = new THREE.TextureLoader(assetManager);

    function loadSurfaceTexture(path, repeatX, repeatY, colorTexture = false) {
      const texture = textureLoader.load(path);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.anisotropy = anisotropy;
      if (colorTexture) texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    const plasterDiffuse = loadSurfaceTexture("/assets/curation-space/materials/plaster-diffuse.jpg", 3, 3, true);
    const plasterNormal = loadSurfaceTexture("/assets/curation-space/materials/plaster-normal.jpg", 3, 3);
    const plasterRoughness = loadSurfaceTexture("/assets/curation-space/materials/plaster-roughness.jpg", 3, 3);
    const stoneDiffuse = loadSurfaceTexture("/assets/curation-space/materials/stone-diffuse.jpg", 5, 4, true);
    const stoneNormal = loadSurfaceTexture("/assets/curation-space/materials/stone-normal.jpg", 5, 4);
    const stoneRoughness = loadSurfaceTexture("/assets/curation-space/materials/stone-roughness.jpg", 5, 4);
    const woodDiffuse = loadSurfaceTexture("/assets/curation-space/materials/wood-diffuse.jpg", 1.5, 4, true);
    const woodNormal = loadSurfaceTexture("/assets/curation-space/materials/wood-normal.jpg", 1.5, 4);
    const woodRoughness = loadSurfaceTexture("/assets/curation-space/materials/wood-roughness.jpg", 1.5, 4);
    const waterNormals = loadSurfaceTexture("/assets/curation-space/materials/water-normals.jpg", 4, 3);

    const material = {
      plaster: new THREE.MeshStandardMaterial({ color: 0xe6e1d5, map: plasterDiffuse, normalMap: plasterNormal, normalScale: new THREE.Vector2(.22, .22), roughnessMap: plasterRoughness, roughness: .92 }),
      stone: new THREE.MeshStandardMaterial({ color: 0xa9aaa5, map: stoneDiffuse, normalMap: stoneNormal, normalScale: new THREE.Vector2(.5, .5), roughnessMap: stoneRoughness, roughness: .82 }),
      stoneDark: new THREE.MeshStandardMaterial({ color: 0x424541, roughness: .86 }),
      wood: new THREE.MeshStandardMaterial({ color: 0x7d5941, map: woodDiffuse, normalMap: woodNormal, normalScale: new THREE.Vector2(.42, .42), roughnessMap: woodRoughness, roughness: .62 }),
      woodDark: new THREE.MeshStandardMaterial({ color: 0x4c3528, map: woodDiffuse, normalMap: woodNormal, normalScale: new THREE.Vector2(.38, .38), roughnessMap: woodRoughness, roughness: .7 }),
      caseInterior: new THREE.MeshStandardMaterial({ color: 0x292822, roughness: .84 }),
      label: new THREE.MeshStandardMaterial({ color: 0xc9c2b1, metalness: .18, roughness: .7 }),
      lightPanel: new THREE.MeshStandardMaterial({ color: 0xf1e8d7, emissive: 0xffdca6, emissiveIntensity: 2.1, roughness: .4 }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xd8e3e0, transmission: .72, transparent: true, opacity: .3, roughness: .1, thickness: .06, ior: 1.48, envMapIntensity: 1.55, depthWrite: false, side: THREE.DoubleSide }),
    };

    function box(name, size, position, surface, options = {}) {
      const geometry = options.rounded
        ? new RoundedBoxGeometry(size[0], size[1], size[2], 3, options.radius || .04)
        : new THREE.BoxGeometry(...size);
      const mesh = new THREE.Mesh(geometry, surface);
      mesh.name = name;
      mesh.position.set(...position);
      mesh.castShadow = options.cast ?? true;
      mesh.receiveShadow = options.receive ?? true;
      scene.add(mesh);
      return mesh;
    }

    // The walkable 1F ring surrounds a clear 3 × 2-bay water court.
    box("south stone walk", [36, .22, 8.5], [0, -.12, 9.75], material.stone, { cast: false });
    box("north stone walk", [36, .22, 8.5], [0, -.12, -9.75], material.stone, { cast: false });
    box("west stone walk", [9.2, .22, 11], [-13.4, -.12, 0], material.stone, { cast: false });
    box("east stone walk", [9.2, .22, 11], [13.4, -.12, 0], material.stone, { cast: false });
    box("exterior ground", [72, .2, 58], [0, -.4, 0], material.stoneDark, { cast: false });
    box("pool bed", [18, .32, 11.4], [0, -.24, 0], material.stoneDark, { cast: false });

    box("pool coping south", [18.8, .22, .34], [0, .03, 5.88], material.stoneDark, { rounded: true, cast: false });
    box("pool coping north", [18.8, .22, .34], [0, .03, -5.88], material.stoneDark, { rounded: true, cast: false });
    box("pool coping west", [.34, .22, 11.4], [-9.22, .03, 0], material.stoneDark, { rounded: true, cast: false });
    box("pool coping east", [.34, .22, 11.4], [9.22, .03, 0], material.stoneDark, { rounded: true, cast: false });

    const water = new Water(new THREE.PlaneGeometry(18.35, 11.05, 1, 1), {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(-18, 32, 18).normalize(),
      sunColor: 0xffecd2,
      waterColor: 0x142e31,
      distortionScale: .42,
      alpha: .88,
      fog: true,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = .035;
    water.receiveShadow = true;
    scene.add(water);

    // A deliberately simple, fully enclosed rectangular gallery surrounds the pool.
    const wallHeight = 10.4;
    box("north wall", [36, wallHeight, .72], [0, wallHeight / 2, -14], material.plaster);
    box("south wall", [36, wallHeight, .72], [0, wallHeight / 2, 14], material.plaster);
    box("east wall", [.72, wallHeight, 28], [18, wallHeight / 2, 0], material.plaster);
    box("west wall", [.72, wallHeight, 28], [-18, wallHeight / 2, 0], material.plaster);
    box("ceiling", [36, .28, 28], [0, wallHeight, 0], material.plaster, { cast: false });

    box("north timber skirting", [35.2, .2, .12], [0, .12, -13.58], material.woodDark);
    box("south timber skirting", [35.2, .2, .12], [0, .12, 13.58], material.woodDark);
    box("east timber skirting", [.12, .2, 27.2], [17.58, .12, 0], material.woodDark);
    box("west timber skirting", [.12, .2, 27.2], [-17.58, .12, 0], material.woodDark);

    box("upper cornice north", [35.2, .18, .18], [0, 8.15, -13.5], material.woodDark);
    box("upper cornice south", [35.2, .18, .18], [0, 8.15, 13.5], material.woodDark);
    box("upper cornice east", [.18, .18, 27.0], [17.5, 8.15, 0], material.woodDark);
    box("upper cornice west", [.18, .18, 27.0], [-17.5, 8.15, 0], material.woodDark);

    for (let x = -8; x <= 8; x += 2) {
      box("suspended lattice north-south", [.12, .16, 12.8], [x, 9.15, 0], material.woodDark, { cast: false });
    }
    for (let z = -5; z <= 5; z += 2.5) {
      box("suspended lattice east-west", [16.2, .16, .12], [0, 9.15, z], material.woodDark, { cast: false });
    }

    [-6, 0, 6].forEach((x) => {
      box("ceiling light", [4.6, .055, .18], [x, 8.92, 0], material.lightPanel, { cast: false });
      const light = new THREE.PointLight(0xffe7c2, 23, 17, 1.7);
      light.position.set(x, 8.7, 0);
      scene.add(light);
    });

    const exhibitPoints = [
      new THREE.Vector3(-6.2, 3.0, -13.2),
      new THREE.Vector3(5.2, 3.0, -13.2),
      new THREE.Vector3(17.2, 2.8, -3.8),
      new THREE.Vector3(17.2, 2.8, 4.3),
      new THREE.Vector3(-5.6, 3.2, 13.2),
      new THREE.Vector3(5.2, 3.35, 13.2),
      new THREE.Vector3(-17.2, 2.75, -4.0),
      new THREE.Vector3(-17.2, 2.55, 4.2),
    ];

    function addLocalBox(group, size, position, surface, rounded = false) {
      const geometry = rounded ? new RoundedBoxGeometry(size[0], size[1], size[2], 3, .045) : new THREE.BoxGeometry(...size);
      const mesh = new THREE.Mesh(geometry, surface);
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    }

    function framedArtwork(index, width, height, position, rotationY = 0) {
      const group = new THREE.Group();
      group.position.set(...position);
      group.rotation.y = rotationY;
      scene.add(group);
      addLocalBox(group, [width + .34, height + .34, .24], [0, 0, -.12], material.woodDark, true);
      addLocalBox(group, [width + .06, height + .06, .08], [0, 0, .025], material.caseInterior, true);

      const imageMaterial = new THREE.MeshStandardMaterial({ color: 0xd8d0bc, roughness: .78, metalness: 0 });
      const imagePlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), imageMaterial);
      imagePlane.position.z = .11;
      group.add(imagePlane);
      textureLoader.load(artifacts[index].image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = anisotropy;
        const sourceAspect = texture.image.width / texture.image.height;
        const frameAspect = (width - .2) / (height - .2);
        if (sourceAspect > frameAspect) imagePlane.scale.set(width - .2, (width - .2) / sourceAspect, 1);
        else imagePlane.scale.set((height - .2) * sourceAspect, height - .2, 1);
        imageMaterial.map = texture;
        imageMaterial.needsUpdate = true;
      });
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(width + .06, height + .06), material.glass);
      glass.position.z = .2;
      group.add(glass);
      const light = new THREE.SpotLight(0xffe4ba, 15, 4.2, Math.PI / 4.7, .72, 1.4);
      light.position.set(0, height / 2 + .45, 1.25);
      light.target.position.set(0, 0, 0);
      group.add(light, light.target);
      const labelPlate = addLocalBox(group, [.72, .03, .24], [width / 2 - .36, -height / 2 - .3, .18], material.label, true);
      labelPlate.rotation.x = -.28;
    }

    framedArtwork(0, 5.2, 3.15, [-6.2, 3.0, -13.52]);
    framedArtwork(1, 5.2, 3.15, [5.2, 3.0, -13.52]);
    framedArtwork(2, 4.9, 2.9, [17.52, 2.8, -3.8], -Math.PI / 2);
    framedArtwork(3, 4.9, 2.9, [17.52, 2.8, 4.3], -Math.PI / 2);
    framedArtwork(4, 4.6, 3.45, [-5.6, 3.2, 13.52], Math.PI);
    framedArtwork(5, 2.9, 4.35, [5.2, 3.35, 13.52], Math.PI);
    framedArtwork(6, 5.5, 1.85, [-17.52, 2.75, -4.0], Math.PI / 2);
    framedArtwork(7, 5.7, 1.35, [-17.52, 2.55, 4.2], Math.PI / 2);

    // Daylight and warm museum accents.
    scene.add(new THREE.HemisphereLight(0xf9f4e6, 0x38433d, 1.35));
    const sun = new THREE.DirectionalLight(0xfff1d7, 3.65);
    sun.position.set(-18, 32, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 72;
    sun.shadow.bias = -.00035;
    scene.add(sun);
    const skylight = new THREE.PointLight(0xe8f0eb, 42, 42, 1.65);
    skylight.position.set(-3, 6.35, 1);
    scene.add(skylight);
    const warmBounce = new THREE.PointLight(0xd7b98b, 27, 27, 1.7);
    warmBounce.position.set(13, 4.8, 10);
    scene.add(warmBounce);

    const clock = new THREE.Clock();
    const projection = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    function angleDelta(from, to) {
      return Math.atan2(Math.sin(to - from), Math.cos(to - from));
    }

    function lookAngles(from, target) {
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      const dz = target.z - from.z;
      return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) };
    }

    function startTransition(position, target) {
      const angles = lookAngles(position, target);
      state.transition = {
        started: performance.now(), duration: 900,
        fromPosition: camera.position.clone(), toPosition: position.clone(),
        fromYaw: state.yaw, toYaw: state.yaw + angleDelta(state.yaw, angles.yaw),
        fromPitch: state.pitch, toPitch: angles.pitch,
      };
      state.targetYaw = state.transition.toYaw;
      state.targetPitch = state.transition.toPitch;
      root.dataset.cameraTransition = "true";
    }

    function validPosition(position) {
      const inBounds = Math.abs(position.x) < 16.7 && Math.abs(position.z) < 12.8;
      const inPool = Math.abs(position.x) < 9.65 && Math.abs(position.z) < 6.35;
      return inBounds && !inPool;
    }

    function moveCamera(forwardAmount, sideAmount) {
      const axes = movementAxes(state.yaw);
      forward.set(axes.forwardX, 0, axes.forwardZ);
      right.set(axes.rightX, 0, axes.rightZ);
      const candidate = camera.position.clone().addScaledVector(forward, forwardAmount).addScaledVector(right, sideAmount);
      if (validPosition(candidate)) camera.position.copy(candidate);
      else {
        const xOnly = camera.position.clone();
        xOnly.x = candidate.x;
        const zOnly = camera.position.clone();
        zOnly.z = candidate.z;
        if (validPosition(xOnly)) camera.position.x = candidate.x;
        if (validPosition(zOnly)) camera.position.z = candidate.z;
      }
    }

    function updateLocation() {
      const { x, z } = camera.position;
      if (z > 6.5) locationEl.textContent = "南侧入口廊";
      else if (z < -6.5) locationEl.textContent = "北侧展廊";
      else if (x > 9.6) locationEl.textContent = "东侧展廊";
      else if (x < -9.6) locationEl.textContent = "西侧木廊";
      else locationEl.textContent = "中央水院";
      root.dataset.cameraX = camera.position.x.toFixed(3);
      root.dataset.cameraZ = camera.position.z.toFixed(3);
      root.dataset.cameraYaw = state.yaw.toFixed(4);
    }

    let viewportWidth = 1;
    let viewportHeight = 1;

    function updateMarkers() {
      markers.forEach((element, index) => {
        if (!state.started || state.detailOpen) {
          element.dataset.visible = "false";
          return;
        }
        projection.copy(exhibitPoints[index]).project(camera);
        const visible = projection.z > -1 && projection.z < 1 && Math.abs(projection.x) < .93 && Math.abs(projection.y) < .86;
        element.dataset.visible = String(visible);
        if (visible) element.style.transform = `translate3d(${(projection.x * .5 + .5) * viewportWidth}px, ${(-projection.y * .5 + .5) * viewportHeight}px, 0)`;
      });
    }

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      viewportWidth = width;
      viewportHeight = height;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function render(now) {
      const delta = Math.min(clock.getDelta(), .07);
      if (root.inert || document.hidden) {
        state.keys.clear();
        state.moveButtons.clear();
        requestAnimationFrame(render);
        return;
      }
      water.material.uniforms.time.value += delta * .16;

      if (state.transition) {
        const progress = Math.min(1, (now - state.transition.started) / state.transition.duration);
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
        camera.position.lerpVectors(state.transition.fromPosition, state.transition.toPosition, eased);
        state.yaw = THREE.MathUtils.lerp(state.transition.fromYaw, state.transition.toYaw, eased);
        state.pitch = THREE.MathUtils.lerp(state.transition.fromPitch, state.transition.toPitch, eased);
        if (progress === 1) {
          state.transition = null;
          delete root.dataset.cameraTransition;
        }
      } else {
        state.yaw += angleDelta(state.yaw, state.targetYaw) * Math.min(1, delta * 13);
        state.pitch += (state.targetPitch - state.pitch) * Math.min(1, delta * 13);
        if (state.started && !state.detailOpen) {
          const ahead = Number(state.keys.has("KeyW") || state.keys.has("ArrowUp") || state.moveButtons.has("forward"))
            - Number(state.keys.has("KeyS") || state.keys.has("ArrowDown") || state.moveButtons.has("back"));
          const side = Number(state.keys.has("KeyD") || state.keys.has("ArrowRight") || state.moveButtons.has("right"))
            - Number(state.keys.has("KeyA") || state.keys.has("ArrowLeft") || state.moveButtons.has("left"));
          if (ahead || side) moveCamera(ahead * delta * 4.2, side * delta * 4.2);
        }
      }
      camera.rotation.set(state.pitch, state.yaw, 0);
      updateLocation();
      updateMarkers();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function closeIndex() {
      indexToggle?.setAttribute("aria-expanded", "false");
      if (indexList) { indexList.hidden = true; indexList.inert = true; }
    }

    function fillDetail(index) {
      const artifact = artifacts[index];
      if (!artifact) return;
      const values = {
        "[data-detail-index]": artifact.index,
        "[data-detail-category]": artifact.category,
        "[data-detail-status]": artifact.recordStatus,
        "[data-detail-title-zh]": artifact.titleZh,
        "[data-detail-title]": artifact.title,
        "[data-detail-date]": artifact.date,
        "[data-detail-material]": artifact.material,
        "[data-detail-location]": artifact.location,
        "[data-detail-story]": artifact.story,
        "[data-detail-interpretation]": artifact.interpretation,
        "[data-detail-source-label]": artifact.sourceLabel,
      };
      Object.entries(values).forEach(([selector, value]) => {
        const element = detail.querySelector(selector);
        if (element) element.textContent = value;
      });
      const image = detail.querySelector("[data-detail-image]");
      image.src = artifact.image;
      image.alt = artifact.imageAlt;
      detail.querySelector("[data-detail-source]").href = artifact.sourceUrl;
    }

    function openDetail(index) {
      state.selected = index;
      state.detailOpen = true;
      state.keys.clear();
      fillDetail(index);
      closeIndex();
      root.dataset.detailOpen = "true";
      detail.inert = false;
      detail.setAttribute("aria-hidden", "false");
      scrim.hidden = false;
      scrim.inert = false;
      window.setTimeout(() => detail.querySelector("[data-detail-close]")?.focus(), 240);
    }

    function closeDetail() {
      if (!state.detailOpen) return;
      state.detailOpen = false;
      delete root.dataset.detailOpen;
      detail.inert = true;
      detail.setAttribute("aria-hidden", "true");
      scrim.hidden = true;
      scrim.inert = true;
      canvas.focus({ preventScroll: true });
    }

    root.querySelector("[data-enter-space]")?.addEventListener("click", () => {
      state.started = true;
      root.dataset.state = "exploring";
      intro.setAttribute("aria-hidden", "true");
      hud.setAttribute("aria-hidden", "false");
      canvas.focus({ preventScroll: true });
    });

    markers.forEach((marker, index) => marker.addEventListener("click", () => openDetail(index)));
    root.querySelectorAll("[data-index-object]").forEach((button) => button.addEventListener("click", () => openDetail(Number(button.dataset.indexObject))));
    root.querySelector("[data-detail-close]")?.addEventListener("click", closeDetail);
    scrim?.addEventListener("click", closeDetail);
    indexToggle?.addEventListener("click", () => {
      const expanded = indexToggle.getAttribute("aria-expanded") === "true";
      indexToggle.setAttribute("aria-expanded", String(!expanded));
      indexList.hidden = expanded;
      indexList.inert = expanded;
    });
    detail.querySelectorAll("[data-detail-direction]").forEach((button) => button.addEventListener("click", () => {
      const offset = button.dataset.detailDirection === "next" ? 1 : -1;
      state.selected = (state.selected + offset + artifacts.length) % artifacts.length;
      fillDetail(state.selected);
    }));

    root.querySelectorAll("[data-viewpoint]").forEach((button) => button.addEventListener("click", () => {
      root.querySelectorAll("[data-viewpoint]").forEach((item) => item.classList.toggle("is-active", item === button));
      const viewpoints = {
        courtyard: [new THREE.Vector3(7.8, 1.68, 11.3), new THREE.Vector3(-4, 2.1, -12.8)],
        collection: [new THREE.Vector3(0, 1.68, 8.2), new THREE.Vector3(-.5, 2.8, -13.5)],
        room: [new THREE.Vector3(-11.8, 1.68, -9.1), new THREE.Vector3(2.4, 5.05, 3.4)],
      };
      const [position, target] = viewpoints[button.dataset.viewpoint];
      startTransition(position, target);
    }));

    window.addEventListener("keydown", (event) => {
      if (root.inert || event.defaultPrevented || !root.contains(event.target)) return;
      if (event.key === "Escape") { if (state.detailOpen) closeDetail(); else closeIndex(); }
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
        state.keys.add(event.code);
      }
    });
    window.addEventListener("keyup", (event) => state.keys.delete(event.code));
    const clearMovement = () => { state.keys.clear(); state.moveButtons.clear(); };
    document.addEventListener("visibilitychange", () => { if (document.hidden) clearMovement(); });
    window.addEventListener("pagehide", clearMovement);

    canvas.addEventListener("pointerdown", (event) => {
      if (!state.started || state.detailOpen) return;
      closeIndex();
      state.dragging = true;
      state.pointerId = event.pointerId;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.transition = null;
      canvas.setPointerCapture(event.pointerId);
      root.dataset.dragging = "true";
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      state.targetYaw = yawAfterDrag(state.targetYaw, event.clientX - state.lastX);
      state.targetPitch = THREE.MathUtils.clamp(state.targetPitch - (event.clientY - state.lastY) * .0031, -.62, .62);
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    });
    const stopDrag = (event) => {
      if (event.pointerId !== state.pointerId) return;
      state.dragging = false;
      state.pointerId = null;
      delete root.dataset.dragging;
    };
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);
    canvas.addEventListener("wheel", (event) => {
      if (!state.started || state.detailOpen) return;
      event.preventDefault();
      moveCamera(-event.deltaY * .0055, 0);
    }, { passive: false });

    root.querySelectorAll("[data-move]").forEach((button) => {
      const start = (event) => { event.preventDefault(); state.moveButtons.add(button.dataset.move); };
      const stop = () => state.moveButtons.delete(button.dataset.move);
      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerup", stop);
      button.addEventListener("pointercancel", stop);
      button.addEventListener("pointerleave", stop);
    });

    new ResizeObserver(resize).observe(canvas);
    resize();
    requestAnimationFrame(render);
  }
}
