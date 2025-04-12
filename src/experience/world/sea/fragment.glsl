uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec2 vUv;

void main() {
  /* COLOR */
  float colorMixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 colorMix = mix(uDepthColor, uSurfaceColor, colorMixStrength);

  /* BORDERS FADE */
  float distX = min(vUv.x, 1.0 - vUv.x);
  float distY = min(vUv.y, 1.0 - vUv.y);
  float dist = min(distX, distY);
  float alpha = smoothstep(0.0, 0.1, dist);

  gl_FragColor = vec4(colorMix, alpha);
  #include <colorspace_fragment>
}