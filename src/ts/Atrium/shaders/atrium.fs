varying vec3 pos;
uniform float time;

void main(){
	vec3 c = vec3(0.6,0.6,0.6);
	float w = max(0.0,1.0 - length(mod(-pos.y * 0.2 + time * 0.6,2.0)));
	w = smoothstep(0.5,1.0,w) * 0.4;
	c += vec3(w);
	gl_FragColor = vec4(1.0,1.0,1.0,w + 0.3);
}