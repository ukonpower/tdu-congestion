uniform float time;
uniform float cPos;

varying vec4 vColor;

void main() {

    vec3 p = position;
    float t = time * 0.5;

    float a = sin(mod( t, 1.0 ) * 3.1415);
    a *= smoothstep( 0.4, 1.0, cPos / 150.0 );

    p *= mod( t, 1.0) * 12.0 + 2.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vColor = vec4( 1.0, 1.0, 1.0, a );
}


