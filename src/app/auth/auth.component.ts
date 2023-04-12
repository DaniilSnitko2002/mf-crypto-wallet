import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  logUser: boolean
  error: string
  isLoading: boolean

  SignUpForm: FormGroup
  LogInForm: FormGroup

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.logUser = true
    this.isLoading = false

    this.LogInForm = new FormGroup({
      'email': new FormControl('', {validators: [Validators.required, Validators.email]}),
      'password': new FormControl('', {validators: Validators.required})
    });

    this.SignUpForm = new FormGroup({
      'username': new FormControl('', {validators: Validators.required}),
      'email': new FormControl('', {validators: [Validators.required, Validators.email]}),
      'password': new FormControl('', {validators: Validators.required}),
      'birth_date': new FormControl('', {validators: Validators.required}),
      'phone_number': new FormControl(0, {validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)]}),
      'deposit': new FormControl(0, {validators: [Validators.required,]})
    });
    
  }
  
  onSubmitReg(){
    if(this.SignUpForm.valid && this.SignUpForm.get('deposit').value != 0 && this.SignUpForm.get('phone_number').value != 0){
      this.isLoading = true
      const user : User = this.SignUpForm.value;
      this.authService.addUser(user)
      .subscribe(resId => {
        if(!!resId && resId != "-1"){
          user.user_id = resId
          sessionStorage.setItem('user', JSON.stringify(user))
          this.router.navigate(['dashboard'])
        }else{
          this.error = 'User already exists'
        }
        this.isLoading = false
      }, error => {
        this.error = 'Database error. Please try again later'
        this.isLoading = false
      });
    }
  }

  onSubmitLog(){
    if(this.LogInForm.valid){
      this.isLoading = true
      const DATA: {email: string, password: string} = this.LogInForm.value
      this.authService.getUser(DATA)
      .subscribe(
        resUser => {
        if(!!resUser){
          const user: User = resUser
          sessionStorage.setItem('user', JSON.stringify(user))
          this.router.navigate(['dashboard'])
        }
        this.isLoading = false
      },error => {
        if (error.status == 404){
          this.error = 'User not found. Incorrect data'
        }else{
          this.error = 'Database error. Please try again later'
        }
        this.isLoading = false
      })
    }
  }

  changeCategory(){
    this.logUser = !this.logUser;
    this.error = null
  }

}
