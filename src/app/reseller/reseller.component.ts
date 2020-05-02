import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../login/user';
import { ResellerService } from './reseller.service';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2'

@Component({
  selector: 'revenda-boticario-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss']
})
export class ResellerComponent implements OnInit {

  constructor(private userService: ResellerService, private toastr: ToastrService) { }

  // Início Declaração de variáveis
  usersList: User[];
  p: number;
  // Fim Declaração de variáveis

  ngOnInit() {
    this.listUser();
  }

  addUser(objForm: NgForm) {
    let userObj: User = new User;
    if (!objForm.control.valid) {
      this.toastr.error('Preencha os campos marcados em vermelho!', 'Erro!');
    } else {
      userObj.name = objForm.value.name;
      userObj.cpf = objForm.value.cpf;
      userObj.email = objForm.value.email;
      userObj.password = btoa(objForm.value.password);
      userObj.isAdmin = false;

      this.userService.add(userObj).subscribe(
        returnAddUser => {
          this.toastr.success('O revendedor(a) foi cadastrado com sucesso!', 'REVENDEDOR(A) CADASTRADO(A)!');
          this.listUser();
        },
        err => {
          console.log("erro", err.message);
        }
      )
    }
  }

  deleteUser(id) {
    this.userService.delete(id).subscribe(
      returnDelete => {
        this.listUser();
        Swal.fire({
          title: 'USUÁRIO DELETADO',
          text: 'Deletamos o usuário solicitado.',
          icon: 'success',
          confirmButtonText: 'Ótimo'
        });
      },
      err => {
        Swal.fire({
          title: 'USUÁRIO NÃO DELETADO',
          text: 'Houve algum erro. Por favor, contate o administrador do sistema!',
          icon: 'error',
          confirmButtonText: 'Entendi'
        });
        console.log("erro", err.message);
      }
    )
  }

  listUser() {
    this.usersList = [];
    this.userService.list().subscribe(
      usersListReturn => {
        this.usersList = usersListReturn.filter(f => f.isAdmin != true);;
      },
      err => {
        this.toastr.error("Erro ao listar os usuários. Contade o administrador!", "Ops...");
        console.log(err.message);
      })
  }

  cpfMask(cpf) {
    cpf = cpf.replace(/\D/g, "")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    document.getElementById("cpfInput")['value'] = cpf;
  }

}
