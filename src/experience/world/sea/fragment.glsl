uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform float uTime;

/* --- FOAM --- */
uniform vec3 uFoamColor;
uniform float uFoamOffset;
uniform float uFoamIntensity;
uniform float uFoamSpeed;
uniform float uFoamScale;
varying float vFoamFactor;
uniform sampler2D uFoamTexture;
/* ------------ */

varying float vElevation;
varying vec2 vUv;
varying vec3 vNormal;

#include <cnoise>

void main() {
  /* COLOR */
  float colorMixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 waterColor = mix(uDepthColor, uSurfaceColor, colorMixStrength);

  /* FOAM */
  float foamTex = texture2D(uFoamTexture, vUv * uFoamScale + vec2(uTime * uFoamSpeed, 0.0)).r;
  foamTex = foamTex * 2.0 - 1.0;

  float foamNoise = cnoise(vec3(vUv * uFoamScale, uTime * uFoamSpeed * 0.5));
  foamNoise = foamNoise * 2.0 - 1.0;

  float foam = vFoamFactor + foamTex * 0.6 + foamNoise * 0.4; 
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