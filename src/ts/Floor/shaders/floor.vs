uniform float time;
varying vec3 vColor;

void main() {
    vec3 p = position;

    vec2 atPos = vec2(0.66,0.64);

    vec3 c = vec3(0.3);
    float l = length(p);
    c -= l * 0.003;
    c = max( c, 0.0 );

    float atW =  max( 0.0, 1.0 - length( uv - atPos ) * 10.0 );
    c += atW * vec3(1.0,0.5,0.5);

    p.z -= atW * 10.0;

    vColor = vec3(c);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = 2.0;
}


