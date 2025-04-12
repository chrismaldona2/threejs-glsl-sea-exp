uniform float uWavesElevation;
uniform vec2 uWavesFrequency;
uniform float uWavesSpeed;
uniform float uTime;

uniform float uChopWavesFrequency;
uniform float uChopWavesElevation;
uniform float uChopWavesIterations;
uniform float uChopWavesSpeed;

varying float vElevation;
varying vec2 vUv;
varying float vFoamFactor;

#include <cnoise>

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uWavesFrequency.x + uTime * uWavesSpeed) *
                    sin(modelPosition.z * uWavesFrequency.y + uTime * uWavesSpeed) *
                    uWavesElevation;

  for(float i = 1.0; i <= uChopWavesIterations; i++) {
    elevation -= abs(cnoise(vec3(modelPosition.xz * uChopWavesFrequency * i, uTime * uChopWavesSpeed)) * uChopWavesElevation / i);
  }

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