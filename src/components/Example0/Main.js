/**
 * Created by zekar on 8/28/2016.
 */

import createShader from '../../helpers/createShader';
import createProgram from '../../helpers/createProgram';

import React from 'react';

import vertexShaderSource from './shaders/vertexShader.glsl';
import fragmentShaderSource from './shaders/fragmentShader.glsl';

// Not an example
class Example0 extends React.Component {
  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    const canvas = this.refs.canvas;
    const gl = canvas.getContext('webgl');

    gl.clearColor(0.74, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
  }

  render() {
    return (<div>
      <canvas ref="canvas" width={300} height={300}></canvas>
    </div>)
  }
}

export default Example3;
