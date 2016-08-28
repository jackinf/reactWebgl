/**
 * Created by zekar on 8/26/2016.
 */
require('normalize.css/normalize.css');
require('styles/App.css');

import createShader from '../../helpers/createShader';
import createProgram from '../../helpers/createProgram';

import React from 'react';

const vertexShaderSource = `
attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor1;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
void main() {
  fragColor1 = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 fragColor1;
void main() {
  gl_FragColor = vec4(fragColor1, 1.0);
}
`;

class Main extends React.Component {
  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const gl = canvas.getContext('webgl');

    // //gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.74, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    /*
      Create shaders
     */
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);

    const boxVertices = [
      -1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
      -1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
      1.0, 1.0, 1.0,      0.5, 0.5, 0.5,
      1.0, 1.0, -1.0,     0.5, 0.5, 0.5,

      -1.0, 1.0, 1.0,   0.75, 0.25, 0.5,
      -1.0, -1.0, 1.0,  0.75, 0.25, 0.5,
      -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
      -1.0, 1.0, -1.0,  0.75, 0.25, 0.5,

      1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
      1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
      1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
      1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

      1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
      1.0, -1.0, 1.0,   1.0, 0.0, 0.15,
      -1.0, -1.0, 1.0,  1.0, 0.0, 0.15,
      -1.0, 1.0, 1.0,   1.0, 0.0, 0.15,

      1.0, 1.0, -1.0,   0.0, 1.0, 0.15,
      1.0, -1.0, -1.0,  0.0, 1.0, 0.15,
      -1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
      -1.0, 1.0, -1.0,  0.0, 1.0, 0.15,

      -1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
      -1.0, -1.0, 1.0,  0.5, 0.5, 1.0,
      1.0, -1.0, 1.0,   0.5, 0.5, 1.0,
      1.0, -1.0, -1.0,  0.5, 0.5, 1.0
    ];

    const boxIndices =
      [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
      ];

    const boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    const boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
      positionAttribLocation,
      3, // number of elements per attribute
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex.
      0// Offset from the beginning of single vertex to this attirbute
    );

    gl.vertexAttribPointer(
      colorAttribLocation,
      3, // number of elements per attribute
      gl.FLOAT,
      gl.FALSE,
      6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex.
      3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of single vertex to this attirbute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    /*
      Main render loop
     */

    gl.useProgram(program);

    const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    const matWorld = new Float32Array(16);
    const matView = new Float32Array(16);
    const matProj = new Float32Array(16);
    mat4.identity(matWorld);
    mat4.lookAt(matView, [0, 0, -10], [0, 0, 0], [0, 1, 0]); // mat, eye, target, up
    mat4.perspective(matProj, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, matWorld);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, matView);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, matProj);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    /*
      Main render loop
     */
    let identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    let angle = 0;
    const loop = function() {
      angle = performance.now() / 1000 / 6 * 2 * Math.PI; // full rotation every 6 seconds
      mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
      mat4.rotate(xRotationMatrix, identityMatrix, angle /4, [1, 0, 0]);
      mat4.mul(matWorld, xRotationMatrix, yRotationMatrix);
      gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, matWorld);

      gl.clearColor(0.75, 0.85, 0.8, 1.0);
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    return (<div>
        <canvas ref="canvas" width={300} height={300}></canvas>
      </div>);
  }
}

export default Main;
