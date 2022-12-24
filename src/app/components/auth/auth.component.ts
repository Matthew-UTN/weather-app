import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  changePage:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  changePageEvent(change:boolean){
    this.changePage = change;
  }
}
