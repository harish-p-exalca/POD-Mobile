import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfViewPageRoutingModule } from './pdf-view-routing.module';

import { PdfViewPage } from './pdf-view.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewPageRoutingModule,
    PdfViewerModule
  ],
  declarations: [PdfViewPage],
  providers:[File,FileOpener]
})
export class PdfViewPageModule {}
