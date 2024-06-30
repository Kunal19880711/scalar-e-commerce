export enum Paths {
  EMPTY = "/",
  Root = "/",
  ID = "/:id",

  Auth = "/auth",
  Login = "/login",
  SsoLogin = "/ssologin",
  Logout = "/logout",

  Api = "/api",
  Product = "/product",
  ProductApi = Paths.Api + Paths.Product,
  User = "/user",
  UserApi = Paths.Api + Paths.User,
  Account = "/account",
  AccountApi = Paths.Api + Paths.Account,

  ResendVerification = "/resendverification",
  VerifyAccount = "/verify",
  ForgotPassword = "/forgotpassword",
  ResetPassword = "/resetpassword",

  Buyer = "/buyer",
  BuyerApi = Paths.Api + Paths.Buyer,
  Cart = "/cart",
  CartApi = Paths.BuyerApi + Paths.Cart,
  Address = "/address",
  AddressApi = Paths.BuyerApi + Paths.Address,
}
