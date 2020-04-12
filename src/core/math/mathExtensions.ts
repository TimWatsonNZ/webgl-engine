export class MathExtension {
  public static clamp = (value: number, min: number, max: number): number => {
    if (value < min) {
      return min;
    }
  
    if (value > max) {
      return max;
    }
  
    return value;
  }
  
  public static degToRad = (degrees: number): number => {
    return degrees * Math.PI/180;
  }
  
  public static radToDeg = (rad: number): number => {
    return rad * 180/Math.PI;
  }
}

