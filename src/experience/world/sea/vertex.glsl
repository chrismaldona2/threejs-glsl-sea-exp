uniform vec2 uWavesFrequency;
uniform float uWavesElevation;
uniform float uWavesWarpIntensity;
uniform float uWavesSpeed;
uniform float uTime;

uniform float uChopWavesFrequency;
uniform float uChopWavesElevation;
uniform float uChopWavesIterations;
uniform float uChopWavesSpeed;

varying float vElevation;
varying vec2 vUv;
varying float vFoamFactor;
varying vec3 vNormal;

#include <cnoise>

/* BASIC DOMAIN WARPING */
vec2 warpDomain(vec2 coord, float time, float warpIntensity, float warpFrequency) {
  float offsetX = cnoise(vec3(coord * warpFrequency, time));
  float offsetY = cnoise(vec3(coord * warpFrequency + 100.0, time));
  return coord + vec2(offsetX, offsetY) * warpIntensity;
}

/* WAVE ELEVATION FUNCTION */
float getElevation(vec2 worldXZ) {
  float elevation = sin(worldXZ.x * uWavesFrequency.x + uTime * uWavesSpeed) * 
                    sin(0.5 * worldXZ.x * uWavesFrequency.x + uTime * uWavesSpeed) *
                    sin(worldXZ.y * uWavesFrequency.y + uTime * uWavesSpeed) * 
                    sin(0.5 * worldXZ.y * uWavesFrequency.y + uTime * uWavesSpeed) *
                    uWavesElevation;

  for(float i = 1.0; i <= uChopWavesIterations; i++) {
    vec2 warpedChopXZ = warpDomain(worldXZ, uTime, uWavesWarpIntensity, uChopWavesFrequency * i);

    elevation -= abs(cnoise(vec3(warpedChopXZ * uChopWavesFrequency * i, uTime * uChopWavesSpeed)) * uChopWavesElevation / i);
  }
  return elevation;
}

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  /* WAVES */
  float elevation = getElevation(modelPosition.xz);
  modelPosition.y += elevation;

  /* FOAM FACTOR */
  float foamFactor = smoothstep(0.0, 0.5, elevation / uWavesElevation); 
  foamFactor = clamp(foamFactor, 0.0, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vElevation = elevation;
  vUv = uv;
  vFoamFactor = foamFactor;
}