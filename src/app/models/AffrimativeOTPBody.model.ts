import { Guid } from "guid-typescript"

export class AffrimativeOTPBody{
      UserGuid:Guid 

          newPassword:string 

          recievedOTP :string

          OTPTransID :string
}