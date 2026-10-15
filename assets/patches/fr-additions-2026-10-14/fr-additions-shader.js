(function (global) {
  'use strict';

  if (global.FRAdditionsShaderRenderer) return;

  var FAMILY = Object.freeze({ gravity: 1, surface: 2, capillarity: 3, forge: 4, resonance: 5 });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sources(webgl2) {
    var vertex = webgl2
      ? '#version 300 es\nin vec2 aPosition;out vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
      : 'attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}';
    var body = [
      'precision highp float;',
      webgl2 ? 'out vec4 outColor;' : '',
      webgl2 ? 'in vec2 vUv;' : 'varying vec2 vUv;',
      'uniform float uProgress;',
      'uniform float uTime;',
      'uniform vec2 uResolution;',
      'uniform vec2 uPointer;',
      'uniform float uVelocity;',
      'uniform float uAmplitude;',
      'uniform float uSeed;',
      'uniform float uQuality;',
      'uniform float uFamily;',
      'float band(float distanceValue,float width){return 1.0-smoothstep(width,width+.012,distanceValue);}',
      'float gravity(vec2 p){float x=p.x-.5;float y=.5+uAmplitude*(x*x-.25)*(.55+.45*uProgress);return band(abs(p.y-y),.008+.006*uQuality);}',
      'float surface(vec2 p){vec2 c=mix(vec2(.18,.5),vec2(.72,.5),uProgress);float r=mix(.08,.54,uProgress);float d=abs(length((p-c)*vec2(uResolution.x/max(uResolution.y,1.0),1.0))-r);return band(d,.01+.006*uAmplitude);}',
      'float capillarity(vec2 p){float branch=sin((p.x*13.0+p.y*4.0+uSeed)*3.14159)*.035;float path=abs(p.y-(.82-uProgress*.64+branch));float second=abs(p.x-(.16+uProgress*.68+sin(p.y*18.0+uSeed)*.025));return max(band(path,.006),band(second,.004)*smoothstep(.28,.8,uProgress));}',
      'float forge(vec2 p){vec2 c=mix(vec2(.5),uPointer,.18);float r=length((p-c)*vec2(uResolution.x/max(uResolution.y,1.0),1.0));float e=sin(3.14159*clamp(uProgress,0.0,1.0));return band(abs(r-(.08+.38*uProgress)),.012+.025*e);}',
      'float resonance(vec2 p){float r=length((p-uPointer)*vec2(uResolution.x/max(uResolution.y,1.0),1.0));float w=abs(sin((r-uProgress*.55)*34.0))*exp(-r*3.2);return smoothstep(.82,.98,w)*sin(3.14159*uProgress);}',
      'void main(){vec2 p=clamp(vUv,0.0,1.0);float force=gravity(p);if(uFamily>1.5)force=surface(p);if(uFamily>2.5)force=capillarity(p);if(uFamily>3.5)force=forge(p);if(uFamily>4.5)force=resonance(p);float grain=(sin((p.x+p.y+uSeed+uTime*.002)*180.0)+1.0)*.025*uQuality;float energy=clamp(force*(.45+.55*uAmplitude)+grain,0.0,1.0);vec3 bone=vec3(.902,.839,.710);vec3 gold=vec3(.965,.655,0.0);vec3 color=mix(bone,gold,clamp(force+abs(uVelocity)*.08,0.0,1.0));float alpha=energy*(.12+.32*sin(3.14159*uProgress));',
      webgl2 ? 'outColor=vec4(color,alpha);}' : 'gl_FragColor=vec4(color,alpha);}'
    ].join('\n');
    return { vertex: vertex, fragment: (webgl2 ? '#version 300 es\n' : '') + body };
  }

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var message = gl.getShaderInfoLog(shader) || 'Falha desconhecida ao compilar shader';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }

  function program(gl, shaderSources) {
    var vertex = compile(gl, gl.VERTEX_SHADER, shaderSources.vertex);
    var fragment = compile(gl, gl.FRAGMENT_SHADER, shaderSources.fragment);
    var output = gl.createProgram();
    gl.attachShader(output, vertex);
    gl.attachShader(output, fragment);
    gl.linkProgram(output);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(output, gl.LINK_STATUS)) {
      var message = gl.getProgramInfoLog(output) || 'Falha desconhecida ao vincular shader';
      gl.deleteProgram(output);
      throw new Error(message);
    }
    return output;
  }

  function Renderer(canvas, options) {
    this.canvas = canvas || null;
    this.options = options || {};
    this.gl = null;
    this.program = null;
    this.buffer = null;
    this.uniforms = {};
    this.webglVersion = 0;
    this.contextLost = false;
    this.mounted = false;
    this.suspended = false;
    this.fallbackReason = null;
    this.renderCount = 0;
    this.progress = 0;
    this.velocity = 0;
    this.pointer = [0.5, 0.5];
    this.family = FAMILY[this.options.family] || FAMILY.capillarity;
    this.seed = Number.isFinite(this.options.seed) ? this.options.seed : 0.618;
    this.amplitude = clamp(Number(this.options.amplitude) || 0.72, 0, 1);
    this.quality = clamp(Number(this.options.quality) || 0.8, 0.25, 1);
    this.boundResize = this.refresh.bind(this);
    this.boundLost = this.onContextLost.bind(this);
    this.boundRestored = this.onContextRestored.bind(this);
    this.resizeObserver = null;
  }

  Renderer.prototype.fallback = function (reason) {
    this.fallbackReason = String(reason || 'WEBGL_UNAVAILABLE');
    if (this.canvas) {
      this.canvas.hidden = true;
      this.canvas.dataset.frapShaderState = 'fallback';
    }
    return false;
  };

  Renderer.prototype.initialize = function () {
    if (!this.canvas || !this.canvas.getContext) return this.fallback('CANVAS_UNAVAILABLE');
    var attributes = { alpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
    this.gl = this.canvas.getContext('webgl2', attributes);
    this.webglVersion = this.gl ? 2 : 0;
    if (!this.gl) {
      this.gl = this.canvas.getContext('webgl', attributes) || this.canvas.getContext('experimental-webgl', attributes);
      this.webglVersion = this.gl ? 1 : 0;
    }
    if (!this.gl) return this.fallback('WEBGL_UNAVAILABLE');
    try {
      this.program = program(this.gl, sources(this.webglVersion === 2));
      this.buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), this.gl.STATIC_DRAW);
      var position = this.gl.getAttribLocation(this.program, 'aPosition');
      this.gl.enableVertexAttribArray(position);
      this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
      ['uProgress', 'uTime', 'uResolution', 'uPointer', 'uVelocity', 'uAmplitude', 'uSeed', 'uQuality', 'uFamily'].forEach(function (name) {
        this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
      }, this);
      this.gl.useProgram(this.program);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.clearColor(0, 0, 0, 0);
      this.canvas.hidden = false;
      this.canvas.dataset.frapShaderState = 'ready';
      this.fallbackReason = null;
      return true;
    } catch (error) {
      this.dispose();
      return this.fallback('SHADER_COMPILE_OR_LINK_FAILED: ' + error.message);
    }
  };

  Renderer.prototype.mount = function () {
    if (this.mounted) return !this.fallbackReason;
    this.mounted = true;
    if (!this.initialize()) return false;
    this.canvas.addEventListener('webglcontextlost', this.boundLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.boundRestored, false);
    if ('ResizeObserver' in global) {
      this.resizeObserver = new ResizeObserver(this.boundResize);
      this.resizeObserver.observe(this.canvas);
    } else global.addEventListener('resize', this.boundResize, { passive: true });
    this.refresh();
    return true;
  };

  Renderer.prototype.refresh = function () {
    if (!this.gl || this.contextLost || !this.canvas) return;
    var rect = this.canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    var mobile = global.matchMedia && global.matchMedia('(max-width:760px)').matches;
    var dpr = Math.min(global.devicePixelRatio || 1, mobile ? 1 : 1.5);
    var width = Math.max(1, Math.round(rect.width * dpr));
    var height = Math.max(1, Math.round(rect.height * dpr));
    var scale = Math.min(1, 2048 / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, width, height);
    this.render(this.progress, this.velocity);
  };

  Renderer.prototype.setPointer = function (x, y) {
    this.pointer[0] = clamp(Number(x) || 0.5, 0, 1);
    this.pointer[1] = clamp(Number(y) || 0.5, 0, 1);
  };

  Renderer.prototype.render = function (progress, velocity) {
    this.progress = clamp(Number(progress) || 0, 0, 1);
    this.velocity = clamp(Number(velocity) || 0, -1, 1);
    if (!this.gl || !this.program || this.contextLost || this.suspended) return false;
    var gl = this.gl;
    gl.useProgram(this.program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(this.uniforms.uProgress, this.progress);
    gl.uniform1f(this.uniforms.uTime, (global.performance ? performance.now() : Date.now()) / 1000);
    gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.uPointer, this.pointer[0], 1 - this.pointer[1]);
    gl.uniform1f(this.uniforms.uVelocity, this.velocity);
    gl.uniform1f(this.uniforms.uAmplitude, this.amplitude);
    gl.uniform1f(this.uniforms.uSeed, this.seed);
    gl.uniform1f(this.uniforms.uQuality, this.quality);
    gl.uniform1f(this.uniforms.uFamily, this.family);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.renderCount += 1;
    return true;
  };

  Renderer.prototype.suspend = function () { this.suspended = true; };
  Renderer.prototype.resume = function () { this.suspended = false; this.refresh(); };
  Renderer.prototype.onContextLost = function (event) { event.preventDefault(); this.contextLost = true; this.fallback('WEBGL_CONTEXT_LOST'); };
  Renderer.prototype.onContextRestored = function () { this.contextLost = false; this.dispose(); if (this.initialize()) this.refresh(); };

  Renderer.prototype.dispose = function () {
    if (!this.gl) return;
    if (this.buffer) this.gl.deleteBuffer(this.buffer);
    if (this.program) this.gl.deleteProgram(this.program);
    this.buffer = null;
    this.program = null;
    this.uniforms = {};
  };

  Renderer.prototype.audit = function () {
    return {
      mounted: this.mounted,
      suspended: this.suspended,
      webglVersion: this.webglVersion,
      contextLost: this.contextLost,
      fallbackReason: this.fallbackReason,
      renderCount: this.renderCount,
      dprWidth: this.canvas ? this.canvas.width : 0,
      dprHeight: this.canvas ? this.canvas.height : 0,
      textureBytes: 0,
      rafActive: 0
    };
  };

  Renderer.prototype.destroy = function () {
    if (!this.mounted) return;
    this.suspended = true;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    else global.removeEventListener('resize', this.boundResize);
    if (this.canvas) {
      this.canvas.removeEventListener('webglcontextlost', this.boundLost, false);
      this.canvas.removeEventListener('webglcontextrestored', this.boundRestored, false);
      this.canvas.dataset.frapShaderState = 'destroyed';
    }
    this.dispose();
    this.gl = null;
    this.mounted = false;
  };

  global.FRAdditionsShaderRenderer = Renderer;
  global.FRAdditionsShaderFamilies = FAMILY;
})(window);
