import { Injectable } from "@angular/core";
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: "root"
})

export class ToastMaker {

  constructor(private toast: ToastController) {

  }

  async wentWrong() {
    let tst = this.toast.create({
      message: "Something Went Wrong! Please try Again",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async MakeToast(m){
    let tst = this.toast.create({
      message:m,
      duration:3000,
      mode:"md"
    });
  (await tst).present();
  }


  async incorrectCredentials() {
    let tst = this.toast.create({
      message: "Incorrect Credentials! Please try Again",
      duration: 3000,
      mode: "md"

    });
    (await tst).present();
  }

  async internetConnection() {
    let tst = this.toast.create({
      message: "Check your Internet Connection!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }
  async wentWrongWithUpdatingInvoices() {
    let tst = this.toast.create({
      message: "Something went wrong while updating invoices!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async checkTable() {
    let tst = this.toast.create({
      message: "Check your Reason or Qty!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async confirmationCancelled() {
    let tst = this.toast.create({
      message: "Invoice updation cancelled by user!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }



  async IncorrectOTP() {
    let tst = this.toast.create({
      message: "Incorrect OTP!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async pwdchangedsuccess() {
    let tst = this.toast.create({
      message: "Password updated successfully!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }
  async pwdchangederror() {
    let tst = this.toast.create({
      message: "Error while updating password!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async itemDetailsUpdationSuccess() {
    let tst = this.toast.create({
      message: "Invoice Item details updated successfully!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async ReConfirmSuccess() {
    let tst = this.toast.create({
      message: "Invoice Confirmed successfully!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async logoutOutSuccess() {
    let tst = this.toast.create({
      message: "Logout success!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }
  async loginsuccess() {
    let tst = this.toast.create({
      message: "Login success!",
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async fileExt(s: string) {
    let tst = this.toast.create({
      message: 'selected file ' + s,
      duration: 2000,
      mode: "md"
    });
    (await tst).present();
  }

  async ErrorOpeningExplr() {
    let tst = this.toast.create({
      message: 'Something went wrong while opening file Explorer!',
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }


  async ErrorUploading() {
    let tst = this.toast.create({
      message: 'Something went wrong while getting file!',
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async ClickSignOutPrompt() {
    let tst = this.toast.create({
      message: 'Please SignOut of your Account!',
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async prompt(s: string) {
    let tst = this.toast.create({
      message: s,
      duration: 10000,
      mode: "md"
    });
    (await tst).present();
  }


  async fileUri(s: string) {
    let tst = this.toast.create({
      message: s,
      duration: 20000,
      mode: "md"
    });
    (await tst).present();
  }


  async InvaldFileExt() {
    let tst = this.toast.create({
      message: 'Attachment should be of type image or pdf!',
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

  async fileUploadEmpty() {
    let tst = this.toast.create({
      message: 'You cannot skip file upload!',
      duration: 2000,
      mode: "md"
    });
    (await tst).present();
  }

  async fileSaved(s: string) {
    let tst = this.toast.create({
      message: 'File saved to ' + s,
      duration: 3000,
      mode: "md"
    });
    (await tst).present();
  }

}