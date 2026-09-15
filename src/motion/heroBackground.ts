const vertexShader = `
attribute vec2 a_pos;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;

#define TAU 6.28318530718
#define SQRT3 1.7320508

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  float n = hash21(p);
  return vec2(n, hash21(p + n * 47.0));
}

vec4 hexTile(vec2 p, float scale) {
  p *= scale;
  vec2 cell = vec2(1.0, SQRT3);
  vec2 halfCell = cell * 0.5;
  vec2 baseA = floor(p / cell);
  vec2 localA = mod(p, cell) - halfCell;
  vec2 offset = p - halfCell;
  vec2 baseB = floor(offset / cell);
  vec2 localB = mod(offset, cell) - halfCell;
  float pick = step(dot(localA, localA), dot(localB, localB));
  return vec4(mix(localB, localA, pick), mix(baseB + vec2(0.5), baseA, pick));
}

float waveField(vec2 p, float t) {
  float wave = sin(dot(p, vec2(0.7, 0.5)) * 3.5 - t * 2.1) * 0.35;
  wave += sin(p.x * 4.2 + t * 1.45) * 0.25;
  float radiusA = length(p - vec2(-0.3, 0.2));
  wave += sin(radiusA * 6.0 - t * 2.4) * 0.2 * smoothstep(1.2, 0.0, radiusA);
  float radiusB = length(p - vec2(0.4, -0.3));
  wave += sin(radiusB * 5.0 - t * 1.8) * 0.15 * smoothstep(1.0, 0.0, radiusB);
  return wave;
}

float dotSegment(vec2 p, vec2 a, vec2 b, float spacing, float radius) {
  vec2 segment = b - a;
  float segmentLength = length(segment);
  vec2 direction = segment / segmentLength;
  float along = clamp(dot(p - a, direction), 0.0, segmentLength);
  float snapped = clamp(floor(along / spacing + 0.5) * spacing, 0.0, segmentLength);
  return smoothstep(radius, radius * 0.25, length(p - (a + direction * snapped)));
}

float sequinSpecular(float tiltAngle, float tiltDirection) {
  vec3 normal = vec3(
    sin(tiltAngle) * cos(tiltDirection),
    sin(tiltAngle) * sin(tiltDirection),
    cos(tiltAngle)
  );
  vec3 light = normalize(vec3(0.35, 0.62, 0.9));
  vec3 reflected = reflect(-light, normal);
  float highlight = max(dot(reflected, vec3(0.0, 0.0, 1.0)), 0.0);
  return pow(highlight, 44.0) + pow(highlight, 8.0) * 0.12;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float t = u_time * 0.34;
  float scale = 38.0;
  vec4 tile = hexTile(uv, scale);
  vec2 localPosition = tile.xy;
  vec2 cellId = tile.zw;
  vec2 randomValue = hash22(cellId);
  float radius = 0.42 * (0.86 + randomValue.x * 0.28);
  float distanceFromCenter = length(localPosition);
  float disc = smoothstep(radius, radius - 0.06, distanceFromCenter);
  float bevel = smoothstep(radius, radius - 0.04, distanceFromCenter)
    - smoothstep(radius - 0.04, radius - 0.08, distanceFromCenter);

  vec2 worldPosition = cellId / scale;
  float wave = waveField(worldPosition, t);
  float tiltAngle = wave * 0.78 + (randomValue.y - 0.5) * 0.12;
  float horizontalWave = waveField(worldPosition + vec2(0.01, 0.0), t);
  float verticalWave = waveField(worldPosition + vec2(0.0, 0.01), t);
  float tiltDirection = atan(verticalWave - wave, horizontalWave - wave);
  float specular = sequinSpecular(tiltAngle, tiltDirection);

  vec2 pixel = gl_FragCoord.xy;
  float aspect = u_res.x / u_res.y;
  float aspectMix = clamp((aspect - 0.4) / 1.0, 0.0, 1.0);
  float characterHeight = min(u_res.x * 0.2, u_res.y * 0.22);
  float centerY = u_res.y * 0.5;
  float topY = centerY + characterHeight * 0.5;
  float bottomY = centerY - characterHeight * 0.5;
  float leftX = u_res.x * mix(0.0, 0.21, aspectMix);
  float rightX = u_res.x * mix(1.0, 0.79, aspectMix);
  float slashWidth = characterHeight * 0.25;
  float starRadius = characterHeight * 0.18;
  float gap = characterHeight * 0.08;
  float spacing = min(u_res.x, u_res.y) / scale;
  float dotRadius = spacing * 0.65;

  float leftSlash = dotSegment(pixel, vec2(leftX, bottomY), vec2(leftX + slashWidth, topY), spacing, dotRadius);
  float leftStarX = leftX + slashWidth + gap + starRadius;
  float leftStar = max(
    dotSegment(pixel, vec2(leftStarX - starRadius, centerY), vec2(leftStarX + starRadius, centerY), spacing, dotRadius),
    max(
      dotSegment(pixel, vec2(leftStarX - starRadius * 0.5, centerY - starRadius * 0.866), vec2(leftStarX + starRadius * 0.5, centerY + starRadius * 0.866), spacing, dotRadius),
      dotSegment(pixel, vec2(leftStarX - starRadius * 0.5, centerY + starRadius * 0.866), vec2(leftStarX + starRadius * 0.5, centerY - starRadius * 0.866), spacing, dotRadius)
    )
  );

  float rightStarX = rightX - slashWidth - gap - starRadius;
  float rightStar = max(
    dotSegment(pixel, vec2(rightStarX - starRadius, centerY), vec2(rightStarX + starRadius, centerY), spacing, dotRadius),
    max(
      dotSegment(pixel, vec2(rightStarX - starRadius * 0.5, centerY - starRadius * 0.866), vec2(rightStarX + starRadius * 0.5, centerY + starRadius * 0.866), spacing, dotRadius),
      dotSegment(pixel, vec2(rightStarX - starRadius * 0.5, centerY + starRadius * 0.866), vec2(rightStarX + starRadius * 0.5, centerY - starRadius * 0.866), spacing, dotRadius)
    )
  );
  float rightSlash = dotSegment(pixel, vec2(rightX - slashWidth, bottomY), vec2(rightX, topY), spacing, dotRadius);
  float symbol = max(max(leftSlash, leftStar), max(rightSlash, rightStar));
  specular += symbol * 0.14;

  float facing = clamp(cos(tiltAngle) * 0.5 + 0.5, 0.0, 1.0);
  vec3 deepInk = vec3(0.012, 0.035, 0.027);
  vec3 forest = vec3(0.035, 0.12, 0.09);
  vec3 mutedGold = vec3(0.55, 0.43, 0.17);
  vec3 paleGold = vec3(0.82, 0.71, 0.38);
  vec3 sequinColor = mix(deepInk, forest, facing * 0.55);
  sequinColor += mutedGold * smoothstep(0.03, 0.28, specular) * 0.36;
  sequinColor += paleGold * smoothstep(0.26, 0.78, specular) * 0.4;
  sequinColor += mutedGold * bevel * facing * 0.18;

  vec3 color = mix(vec3(0.006, 0.022, 0.017), sequinColor, disc);
  float vignette = 1.0 - smoothstep(0.35, 1.25, length(uv));
  color *= 0.48 + 0.52 * vignette;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error("Hero background shader failed to compile", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

export function initSiteBackground(root: ParentNode = document): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-site-background]");
  if (!canvas) return () => undefined;
  const animated = canvas.dataset.siteBackground === "animated";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: !animated || reducedMotion.matches,
  });
  if (!gl) return () => undefined;

  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (!vertex || !fragment) return () => undefined;

  const program = gl.createProgram();
  if (!program) return () => undefined;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Hero background program failed to link", gl.getProgramInfoLog(program));
    return () => undefined;
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const time = gl.getUniformLocation(program, "u_time");
  const resolution = gl.getUniformLocation(program, "u_res");
  let frame = 0;
  let needsResize = true;
  const isPaused = () => document.hidden || document.documentElement.classList.contains("is-index-open");

  const resize = () => {
    const dprLimit = window.innerWidth <= 680 ? 1.25 : 1.5;
    const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    }
    needsResize = false;
  };

  const draw = (now = 0) => {
    if (needsResize) resize();
    gl.uniform1f(time, !animated || reducedMotion.matches ? 0 : now * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const render = (now: number) => {
    draw(now);
    frame = !animated || reducedMotion.matches || isPaused() ? 0 : window.requestAnimationFrame(render);
  };

  const start = () => {
    if (frame || isPaused()) return;
    if (!animated || reducedMotion.matches) {
      draw(0);
      return;
    }
    frame = window.requestAnimationFrame(render);
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const handleResize = () => {
    needsResize = true;
    if (!animated || reducedMotion.matches || isPaused()) draw(0);
  };
  const handleVisibility = () => {
    if (isPaused()) stop();
    else start();
  };
  const handleMotionChange = () => {
    stop();
    start();
  };
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  reducedMotion.addEventListener("change", handleMotionChange);
  const indexObserver = new MutationObserver(handleVisibility);
  indexObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  resize();
  start();

  return () => {
    stop();
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handleVisibility);
    reducedMotion.removeEventListener("change", handleMotionChange);
    indexObserver.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
}
