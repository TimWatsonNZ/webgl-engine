class GlUtilities {
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;

    if (elementId) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;

    } else {
      canvas = document.createElement('canvas');
      document.body.append(canvas);
    }

    gl = canvas.getContext('webgl');

    return canvas;
  }
}

let gl: WebGLRenderingContext;

export { gl, GlUtilities };