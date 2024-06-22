import { Roles } from "./Roles";

export abstract class Constants {
  public static readonly SignUpRolesAllowed = [Roles.Seller, Roles.Buyer];

  public static readonly OtpLifeInSeconds = 10 * 60; // 10 minutes;

  public static readonly OtpLength = 6;
}
