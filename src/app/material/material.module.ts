import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';

const MaterialComponents =[
  MatButtonModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatTableModule,
  MatInputModule,
  MatRadioModule,
  MatDialogModule,
  MatSelectModule,
  MatMenuModule,
  MatNativeDateModule ,
  MatDatepickerModule,
  MatIconModule
];


@NgModule({
  
  imports: [
    MaterialComponents
  ],
  exports:[
   MaterialComponents
  ]
})
export class MaterialModule { }
