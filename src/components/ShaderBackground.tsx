import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      // Fallback for environments where WebGL is unsupported
      let frameId: number;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeCanvas2d = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        resizeCanvas2d();
        window.addEventListener('resize', resizeCanvas2d);

        let t = 0;
        const render2d = () => {
          t += 0.005;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw extremely soft ambient blobs simulating swirl
          const cx1 = canvas.width * 0.5 + Math.cos(t) * 100;
          const cy1 = canvas.height * 0.5 + Math.sin(t * 0.8) * 100;
          const grad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, 400);
          grad1.addColorStop(0, 'rgba(129, 238, 232, 0.04)');
          grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad1;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const cx2 = canvas.width * 0.5 + Math.sin(t * 1.2) * 120;
          const cy2 = canvas.height * 0.5 + Math.cos(t * 0.9) * 120;
          const grad2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, 350);
          grad2.addColorStop(0, 'rgba(66, 194, 139, 0.03)');
          grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad2;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Film grain noise overlay
          ctx.fillStyle = 'rgba(17, 17, 17, 0.008)';
          for (let i = 0; i < 4000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillRect(x, y, 1, 1);
          }

          frameId = requestAnimationFrame(render2d);
        };
        render2d();

        return () => {
          window.removeEventListener('resize', resizeCanvas2d);
          cancelAnimationFrame(frameId);
        };
      }
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        vUv.y = 1.0 - vUv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source (Swirl + Film Grain)
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;

      // Pseudo-random noise for film grain
      float noise(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) + 0.5;

        // Subtle slow swirling offset
        float dist = distance(aspectUv, vec2(0.5));
        float angle = atan(aspectUv.y - 0.5, aspectUv.x - 0.5);
        
        // Soft swirling speed and frequency
        float swirl = sin(dist * 2.5 - uTime * 0.08) * 0.15;
        vec2 swirledUv = vec2(
          0.5 + cos(angle + swirl) * dist,
          0.5 + sin(angle + swirl) * dist
        );

        // Define ambient palette colors (Primary green, Accent teal, Highlight yellow, Pure White)
        vec3 colorWhite = vec3(1.0, 1.0, 1.0);
        vec3 colorTeal = vec3(0.505, 0.933, 0.909);   // #81EEE8
        vec3 colorGreen = vec3(0.258, 0.761, 0.545);  // #42C28B
        vec3 colorYellow = vec3(0.984, 0.965, 0.737); // #FBF6BC

        // Calculate slow-changing noise vectors for color mixing
        float n1 = sin(swirledUv.x * 3.0 + uTime * 0.15) * cos(swirledUv.y * 3.5 + uTime * 0.1) * 0.5 + 0.5;
        float n2 = sin(swirledUv.y * 4.0 - uTime * 0.1) * cos(swirledUv.x * 2.5 + uTime * 0.12) * 0.5 + 0.5;

        // Combine colored fields with dominant white background (ambient wash)
        vec3 mix1 = mix(colorWhite, colorTeal, n1 * 0.05);
        vec3 mix2 = mix(mix1, colorGreen, n2 * 0.04);
        vec3 finalColor = mix(mix2, colorYellow, (1.0 - dist) * 0.03);

        // Film grain generation
        float grain = noise(uv * uTime) * 0.015;
        finalColor += vec3(grain - 0.0075);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Helper to compile shaders
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup screen quad positions
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const resolutionLoc = gl.getUniformLocation(program, 'uResolution');

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let startTime = Date.now();

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000.0;
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (gl) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
