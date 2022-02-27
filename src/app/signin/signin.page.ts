import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GetService } from '../services/getservice.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  
  constructor(private router:Router,private getService:GetService) { }

  ngOnInit() {
  }

  
  
}
