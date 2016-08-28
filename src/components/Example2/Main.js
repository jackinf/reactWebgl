/**
 * Created by zekar on 8/26/2016.
 */
require('normalize.css/normalize.css');
require('styles/App.css');

import createShader from '../../helpers/createShader';
import createProgram from '../../helpers/createProgram';

import React from 'react';

import vertexShaderSource from './shaders/vertexShader.glsl';
import fragmentShaderSource from './shaders/fragmentShader.glsl';

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

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);

    const triangleVertices = [
    // X,    Y,   R, G, B
      0.0, 0.5, 1.0, 1.0, 0.0,
      -0.5, -0.5, 0.7, 0.0, 1.0,
      0.5, -0.5, 0.3, 0.5, 0.1
    ];

    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    // gl.STATIC_DRAW - sending data from CPU to GPU only once
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
      positionAttribLocation,
      2, // number of elements per attribute
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex.
      0// Offset from the beginning of single vertex to this attirbute
    );

    gl.vertexAttribPointer(
      colorAttribLocation,
      3, // number of elements per attribute
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex.
      2 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of single vertex to this attirbute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    /*
      Main render loop
     */

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);  // gl.TRIANGLES - used practically 99% of all times
  }

  render() {
    return (<div>
        <canvas ref="canvas" width={300} height={300}></canvas>
      </div>);
  }
}

export default Main;
