uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uTime;

/* --- FOAM --- */
uniform vec3 uFoamColor;
uniform float uFoamOffset;
uniform float uFoamNoiseIntensity;
uniform float uFoamIntensity;
uniform float uFoamSpeed;
uniform float uFoamScale;
varying float vFoamFactor;
/* ------------ */

varying float vElevation;
varying vec2 vUv;

#include <cnoise>

void main() {
  /* COLOR */
  float colorMixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 waterColor = mix(uDepthColor, uSurfaceColor, colorMixStrength);

  /* FOAM */
  float foamNoise = cnoise(vec3(vUv * uFoamScale, uTime * uFoamSpeed));
  float foam = vFoamFactor + foamNoise * uFoamNoiseIntensity; 
  foam = smoothstep(uFoamOffset, uFoamOffset + 0.2, foam) * uFoamIntensity;
  foam = clamp(foam, 0.0, 1.0);

  /* BORDERS FADE */
  float distX = min(vUv.x, 1.0 - vUv.x);
  float distY = min(vUv.y, 1.0 - vUv.y);
  float dist = min(distX, distY);
  float alpha = smoothstep(0.0, 0.1, dist);

  vec3 finalColor = mix(waterColor, uFoamColor, foam);

  gl_FragColor = vec4(finalColor, alpha);
  #include <colorspace_fragment>
}