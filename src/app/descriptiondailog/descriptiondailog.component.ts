import {
  Component,
  OnInit,
  Inject,
  Input,
  ElementRef,
  ViewChild,
} from "@angular/core";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  Camera,
} from "@capacitor/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { StorageService } from "../services/storage.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GetService } from "../services/getservice.service";
import { invUpdateandformdata } from "../models/invUpdateandformdata.model";
import { Platform, NavParams, ModalController } from "@ionic/angular";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
import { ToastMaker } from "../Toast/ToastMaker.service";
import { DatePipe } from "@angular/common";
import { FormControl, Validators } from "@angular/forms";
@Component({
  selector: "app-descriptiondailog",
  templateUrl: "./descriptiondailog.component.html",
  styleUrls: ["./descriptiondailog.component.scss"],
})
export class DescriptiondailogComponent implements OnInit {
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  image;
  photo: SafeResourceUrl;
  qnty: number;
  @Input() headerid: number;
  i = 0;
  j = 0;
  @Input() createdby: string = "";
  @Input() inv_no: string = "";
  @Input() l_dt: string;
  @Input() i_dt: string;
  isfileempty = true;
  current_date = new Date();
  dtpipe: DatePipe;
  maxdate: string;
  mindate: string;
  submitclicked = false;
  form: FormData = new FormData();
  IsSave: boolean = false;
  IsReConfirm: boolean = false;
  returndata: invUpdateandformdata = new invUpdateandformdata();
  vehicleReportedDate;
  DatePipe: DatePipe = new DatePipe("en-US");
  constructor(
    private sanitizer: DomSanitizer,
    private toast: ToastMaker,
    private filechooser: FileChooser,
    private filepath: FilePath,
    private platform: Platform,
    private modalCtrl: ModalController,
    private navParam: NavParams
  ) {
    this.headerid = this.navParam.get("headerid");
    this.createdby = this.navParam.get("createdby");
    this.inv_no = this.navParam.get("inv_no");
    this.l_dt = this.navParam.get("l_dt");
    this.i_dt = this.navParam.get("i_dt");
    this.IsSave = this.navParam.get("IsSave");
    this.IsReConfirm = this.navParam.get("IsReconfirm");
    this.vehicleReportedDate = this.navParam.get("vehicleReportedDate");
    if (this.l_dt === null) {
      this.mindate = this.i_dt.slice(0, 10);
    } else {
      this.mindate = this.l_dt.slice(0, 10);
    }
    if (this.vehicleReportedDate) {
      this.reportdate.setValue(this.vehicleReportedDate);
    }
    this.dtpipe = new DatePipe("en-US");
    this.maxdate = this.dtpipe.transform(this.current_date, "yyyy-MM-dd");
  }
  selectedFile: File;
  filename: string = "No file";
  a: string = "No";
  reportdate: FormControl = new FormControl("", Validators.required);
  rcvdqnty: number;
  ngOnInit(): void {}

  async clickPicture() {
    this.isfileempty = true;
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,

      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    this.form = new FormData();
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.webPath
    );
    const blob = await fetch(image.webPath).then((r) => r.blob());

    this.form.append(
      "cam" + this.inv_no + ".png",
      blob,
      "cam" + this.inv_no + ".png"
    );
    console.log("hello");
    this.filename = "No file";
    this.i = 1;
    this.a = JSON.stringify(this.i);
    // POST formData call
    this.returndata.isfileEmpty = false;
    this.isfileempty = false;
  }

  onFileChanged(event: EventTarget) {
    this.isfileempty = true;
    const eventObj: any = event;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    this.selectedFile = target.files[0];
    console.log(this.selectedFile);

    let splitfortype = this.selectedFile.name.split(".");
    let type = splitfortype[splitfortype.length - 1];
    if (type == "png" || type == "jpg" || type == "jpeg" || type == "pdf") {
      this.form = new FormData();
      this.form.append(
        this.selectedFile.name,
        this.selectedFile,
        this.selectedFile.name
      );
      this.filename = this.selectedFile.name.substring(0, 12);
      this.toast.fileExt(this.selectedFile.name);
      console.log(this.form.get(this.selectedFile.name));
      this.i = 0;
      this.a = JSON.stringify(this.i);
      this.returndata.isfileEmpty = false;
      this.isfileempty = false;
    } else {
      this.isfileempty = true;
      this.toast.InvaldFileExt();
    }
  }

  save() {
    this.submitclicked = true;
    if (this.IsReConfirm && !this.IsSave) {
      if (!this.isfileempty) {
        this.form.append("HeaderID", this.headerid.toString());
        this.form.append("CreatedBy", this.createdby);
        this.returndata.files = this.form;
        this.returndata.reportdate = this.DatePipe.transform(
          this.reportdate.value,
          "yyyy-MM-dd"
        );
        this.modalCtrl.dismiss(
          this.returndata,
          this.selectedFile
            ? this.selectedFile.name
            : "cam" + this.inv_no + ".png"
        );
      } else {
        if (this.isfileempty) {
          this.toast.fileUploadEmpty();
        }
      }
    } else if (!this.IsReConfirm && this.IsSave) {
      if (this.reportdate.valid) {
        this.form.append("HeaderID", this.headerid.toString());
        this.form.append("CreatedBy", this.createdby);
        this.returndata.files = this.form;
        this.returndata.reportdate = this.DatePipe.transform(
          this.reportdate.value,
          "yyyy-MM-dd"
        );
        this.modalCtrl.dismiss(
          this.returndata,
          this.selectedFile
            ? this.selectedFile.name
            : "cam" + this.inv_no + ".png"
        );
      } else {
        this.reportdate.markAsTouched();
        this.reportdate.markAsDirty();
      }
    } else {
      if (this.reportdate.valid) {
        if (!this.isfileempty) {
          this.form.append("HeaderID", this.headerid.toString());
          this.form.append("CreatedBy", this.createdby);
          this.returndata.files = this.form;
          this.returndata.reportdate = this.DatePipe.transform(
            this.reportdate.value,
            "yyyy-MM-dd"
          );
          this.modalCtrl.dismiss(
            this.returndata,
            this.selectedFile
              ? this.selectedFile.name
              : "cam" + this.inv_no + ".png"
          );
        } else {
          if (this.isfileempty) {
            this.toast.fileUploadEmpty();
          }
        }
      } else {
        this.reportdate.markAsTouched();
        this.reportdate.markAsDirty();
      }
    }
  }
}
