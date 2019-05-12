uniform float time;
varying vec3 pos;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;

	pos = position;
}