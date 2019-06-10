attribute vec3 offsetPos;
attribute vec2 offsetUV;

varying vec3 vViewPosition;
uniform float time;

float PI = 3.141592653589793;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

$noise3D

void main() {
    vec3 pos = position;

    vec2 atPos = vec2(0.5,0.5);

    float atW =  max( 0.0, 1.0 - length( offsetUV - atPos ) * 1.9 ) * 100.0;

    // pos.y *= atW * 1.0;

    // pos.y *= sin(time + offsetUV.x * 10.0) * 20.0;

    pos.y *= max(0.0,snoise(vec3(offsetPos.xz * 0.03,time * 0.1)) * 20.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;
}