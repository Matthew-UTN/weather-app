import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;

  inProgress:boolean = false;

  @Output() goToLogin = new EventEmitter<boolean>();
  emailError:boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  register(){
    this.inProgress = true;
    this.emailError = false; 
    this.auth.registerUser(this.email, this.password).catch((err) => {
      this.emailError = true; 
      this.inProgress = false;  
    });
  }

  changePage(){
    this.goToLogin.emit(false);
  }

}
