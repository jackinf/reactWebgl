attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor1;
void main() {
  fragColor1 = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}
