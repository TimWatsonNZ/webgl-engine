class GlUtilities {
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;

    if (elementId) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;

    } else {
      const div = document.createElement('div');
      div.id = 'gameArea';
      canvas = document.createElement('canvas');

      div.appendChild(canvas);
      document.body.append(div);
    }

    gl = canvas.getContext('webgl');

    return canvas;
  }
}

let gl: WebGLRenderingContext;

export { gl, GlUtilities };