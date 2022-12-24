import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  inProgress:boolean = false;

  @Output() goToRegister = new EventEmitter<boolean>();
  emailError:boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  login(){
    this.inProgress = true;
    this.auth.login(this.email, this.password).catch((err) => {
      this.emailError = true; 
      this.inProgress = false;  
    });
  }

  changePage(){
    this.goToRegister.emit(true);
  }

}
