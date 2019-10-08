export class GameSettings {
  public scaleX: number = 64;
  public scaleY: number = 64;

  constructor(
    public width: number,
    public height: number,
    public rows: number,
    public cols: number,
    public fps: number
  ) {
  }
}
