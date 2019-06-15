attribute vec3 offsetPos;
attribute vec2 offsetUV;

uniform float time;

uniform float atriumW;
uniform float loungeW;
uniform float syokudoW;


varying vec3 vViewPosition;
varying vec4 vColor;

$noise3D
$constants

void main() {
    vec3 pos = position;
    pos.y += 0.5;

    vec2 atriumPos = vec2(0.68,0.65);
    vec2 loungePos = vec2(0.44,0.46);
    vec2 syokudoPos = vec2(0.3,0.25);

    float f = 0.0;
    float range = 10.0;
    f += max( 0.0, 1.0 - length(atriumPos - offsetUV) * range) * atriumW;
    f += max( 0.0, 1.0 - length(loungePos - offsetUV) * range) * loungeW;
    f += max( 0.0, 1.0 - length(syokudoPos - offsetUV) * range) * syokudoW;

    //scale
    pos.y *= 1.0;

    //offset
    pos.y -= 5.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos + offsetPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vViewPosition = -mvPosition.xyz;

    float baseAlpha = max( 0.0, 1.0 - length(offsetUV * 2.0 - 1.0) );
    float alpha = f * 0.6 + 0.1 * baseAlpha;
    vColor = vec4(1.0,1.0,1.0,alpha);

}