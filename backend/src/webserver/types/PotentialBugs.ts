export abstract class PotentialBugs {
  public static readonly AuthDecoratorBug = new Error(
    "Either Auth decorator is not working or Auth middleware is not working."
  );
}
