import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation.service';
import { GetService } from '../services/getservice.service';
import { ToastMaker } from '../Toast/ToastMaker.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.page.html',
  styleUrls: ['./pdf-view.page.scss'],
})
export class PdfViewPage implements OnInit {
  resourceUri;
  pdfSource;
  zoom = 1;
  rotation = 0;
  isResourceLoaded: boolean = false;
  docData: any;

  constructor(
    private sanitizer: DomSanitizer,
    private getservice: GetService,
    private loading: LoadingAnimation,
    private loadingController: LoadingController,
    private toast: ToastMaker,
    private activatedRoute: ActivatedRoute,
    private file: File,
    private fileOpener: FileOpener
  ) {

  }

  ngOnInit(): void {

  }

  ionViewWillEnter() {
    this.docData = JSON.parse(this.activatedRoute.snapshot.paramMap.get('doc_data'));
    this.isResourceLoaded = false;
    this.DowloandPODDocument(this.docData.HeaderID, this.docData.AttachmentID, this.docData.AttachmentName);
  }

  DowloandPODDocument(HeaderID: number, AttachmentID: number, fileName: string): void {
    this.loading.presentLoading().then(() => {
      this.getservice.DowloandPODDocument(HeaderID, AttachmentID).subscribe(
        data => {
          if (data) {
            // console.log("Base64String",data);
            // let fileType = 'application/pdf';
            // const blob = new Blob([data], { type: fileType });
            this.resourceUri = data;
            this.pdfSource = this._base64ToArrayBuffer(this.resourceUri);
            this.isResourceLoaded = true;
            this.loadingController.getTop().then((has) => {
              if (has) {
                this.closeLoader();
              }
            });
          }
        },
        (catchError) => {
          this.loadingController.getTop().then((has) => {
            if (has) {
              this.closeLoader();
            }
          });
          if (catchError.status == 0) {
            this.toast.internetConnection();
          }
          else {
            this.toast.wentWrong();
          }
        });
    });
  }

  LoadResourceURL() {
    if (this.isResourceLoaded) {
      // let ResourceCopyURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.resourceUri)['changingThisBreaksApplicationSecurity'];
      // console.log("Resource Copy this one", ResourceCopyURL);
      return this.pdfSource;
    }
    else {
      return "";
    }
  }

  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // blobToBase64(blob) {
  //   return new Promise((resolve, _) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.readAsDataURL(blob);
  //   });
  // }

  rotateDoc() {
    this.rotation += 90;
  }
  zoomOut() {
    this.zoom -= 0.25;
  }
  zoomIn() {
    this.zoom += 0.25;
  }

  async closeLoader() {
    // Instead of directly closing the loader like below line
    // return await this.loadingController.dismiss();

    this.checkAndCloseLoader();

    // sometimes there's delay in finding the loader. so check if the loader is closed after one second. if not closed proceed to close again
    setTimeout(() => this.checkAndCloseLoader(), 1000);

  }

  async checkAndCloseLoader() {
    // Use getTop function to find the loader and dismiss only if loader is present.
    const loader = await this.loadingController.getTop();
    // if loader present then dismiss
    if (loader !== undefined) {
      await this.loadingController.dismiss();
    }
  }

  LocalDownload() {
    this.loading.presentLoading().then(() => {
      fetch('data:application/pdf;base64,' + this.resourceUri,
        {
          method: "GET"
        }).then(res => res.blob()).then(blob => {
          this.file.writeFile(this.file.externalRootDirectory+"/Download/", this.docData?.AttachmentName, blob, { replace: true }).then(res => {
            // this.fileOpener.open(
            //   res.toInternalURL(),
            //   'application/pdf'
            // ).then((res) => {
            //   console.log('file opened',res)
            // }).catch(err => {
            //   console.log('open error',err)
            // });
            this.toast.fileSaved(res.toInternalURL());
            this.loadingController.getTop().then((has) => {
              if (has) {
                this.closeLoader();
              }
            });
          }).catch(err => {
            this.loadingController.getTop().then((has) => {
              if (has) {
                this.closeLoader();
              }
            });
            console.log('save error', err)
          });
        }).catch(err => {
          this.loadingController.getTop().then((has) => {
            if (has) {
              this.closeLoader();
            }
          });
          console.log('error', err)
        });
    });
  }
}
