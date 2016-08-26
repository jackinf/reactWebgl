/**
 * Created by zekar on 8/26/2016.
 */

import React from 'react';

import vertexShaderSource from './shaders/vertexShader.glsl';
import fragmentShaderSource from './shaders/fragmentShader.glsl';

import createShader from '../../helpers/createShader';
import createProgram from '../../helpers/createProgram';

class Main extends React.Component {
  componentDidMount() {
    this._updateCanvas();
  }

  _updateCanvas = () => {
    const canvas = this.refs.canvas;
    const gl = canvas.getContext('webgl');

    //gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.74, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  };

  render() {
    return (<div>
        <canvas ref="canvas" width={300} height={300}></canvas>
      </div>);
  }
}

export default Main;
