import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { LoginService } from './login.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'revenda-boticario-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  private authenticatedUser: boolean = false;

  constructor(private loginService: LoginService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login(formLogin: NgForm) {
    if (formLogin.form.value.email == undefined) {
      this.toastr.error('Insira um Email!', 'Ops...');
    } else if (formLogin.form.value.password == undefined) {
      this.toastr.error('Digite sua senha!', 'Ops...');
    } else {
      //as senhas estão criptografadas em base64, não é a mais segura, mas, já é uma segurança
      //obs: procurei nao me profundar muito nisto.
      this.user.email = formLogin.form.value.email;
      this.user.password = btoa(formLogin.form.value.password);
      this.loginService.login(this.user);
    }
  }

}
