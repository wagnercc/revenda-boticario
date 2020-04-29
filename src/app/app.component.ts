import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { User } from './login/user';

@Component({
  selector: 'revenda-boticario-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser: User;
  name: string = "";
  isAdmin: boolean = true;

  constructor(private loginService: LoginService) {
    this.loginService.currentUser.subscribe(x => this.currentUser = x);
    this.isAdmin = loginService.isAdmin();
  }

  ngOnInit() {
    if (this.currentUser != null) {
      this.name = this.currentUser.name;
    } else {
      this.name = "Usuário";
    }
  }

  logout() {
    this.loginService.logout();
  }
}
