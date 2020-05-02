import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { ShopModel } from './shopModel';
import { NgForm } from '@angular/forms';
import { User } from '../login/user';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2'

@Component({
  selector: 'revenda-boticario-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(private shopServices: ShopService, private toastr: ToastrService) { }

  // Início Declaração de variáveis
  shopsList: ShopModel[];
  userModel: User;
  valueCashbackDiscount: number = 0;
  valueCashbackDiscountDisplay: string;
  valueCashbackApplicated: string = "0,00";
  haveCashback: boolean = true;
  shopListApproveds = [];
  p: number;
  // Fim Declaração de variáveis

  ngOnInit() {
    this.shopList();
  }

  /**
   * The function list all shops for actual user
   * @author Wagner Castilho
   *
   */
  shopList() {
    let userModel = this.getUserFromSessionStorage();
    this.shopsList = [];
    this.shopServices.list().subscribe(
      shopsListReturn => {
        this.getCashbackDiscount(shopsListReturn);
        this.shopsList = shopsListReturn.filter(f => f.idUser == userModel.id);;
      },
      err => {
        this.toastr.error("Erro ao listar a tabela de compras. Contade o administrador!", "Ops...");
        console.log(err.message);
      })
  }

  /**
   * The function delete a shop from database
   * @author Wagner Castilho
   *
   * @params id - for delete a specify register
   */
  deleteShop(id) {
    this.shopServices.delete(id).subscribe(
      returnDelete => {
        this.shopList();
        Swal.fire({
          title: 'COMPRA DELETADA',
          text: 'Deletamos o registro da sua compra.',
          icon: 'success',
          confirmButtonText: 'Ótimo'
        });
      },
      err => {
        Swal.fire({
          title: 'COMPRA NÃO DELETADA',
          text: 'Houve algum erro. Por favor, contate o administrador do sistema!',
          icon: 'error',
          confirmButtonText: 'Entendi'
        });
        console.log("erro", err.message);
      }
    )
  }

  /**
   * The function add a new shop on database
   * @author Wagner Castilho
   *
   * @params formObj - contains a form data from html inputs
   */
  shopAdd(formObj: NgForm) {
    let moneyValue = document.getElementById('inputValue')['value'].substring(3, 20);
    // validação simples utilizando o ngForm
    if (!formObj.control.valid) {
      this.toastr.error('Preencha os campos marcados em vermelho!', 'Erro!');
    } else {
      let shopObj: ShopModel = new ShopModel;
      shopObj.idUser = this.getUserFromSessionStorage().id;
      shopObj.code = formObj.value.codigo;
      shopObj.date = new Date(formObj.value.data).toLocaleDateString('pt-BR');
      if (this.haveCashback) {
        this.setInactiveShopRegister();
        let valueOnCashback;
        if (this.valueCashbackApplicated.includes(",")) {
          valueOnCashback = (parseFloat(this.valueCashbackApplicated.split(".").join("").replace(",", ".")));
        } else {
          let addDecimalCase = this.valueCashbackApplicated + ",00";
          valueOnCashback = parseFloat(addDecimalCase.split(".").join("").replace(",", "."));
        }

        //if para verificar se o valor digitado é maior do que o cashback aplicado
        if (this.valueCashbackApplicated > "0") {
          let cashback = this.cashbackGenerate();
          let cashbackValue = Math.floor((cashback / 100) * valueOnCashback);

          shopObj.value = this.valueCashbackApplicated;
          shopObj.cashbackPorcent = cashback;
          shopObj.cashbackValue = cashbackValue.toLocaleString('pt-BR');
          shopObj.status = "Em análise";
        } else {
          let cashbackRemaining, diffValueCashback; //variavel diff pois pega o valor digitado - menos o cashback e subtrai com o valor total do cashback
          //if para verificar se o número é negativo e aplicar o calculo adequado
          if (valueOnCashback < 0) {
            diffValueCashback = this.valueCashbackDiscount + valueOnCashback
          } else {
            diffValueCashback = this.valueCashbackDiscount - valueOnCashback
          }

          cashbackRemaining = this.valueCashbackDiscount - diffValueCashback;
          shopObj.cashbackPorcent = 0;
          shopObj.cashbackValue = cashbackRemaining.toLocaleString("pt-BR");
          shopObj.value = "0,00";
          shopObj.status = "Aprovado";
        }
      } else {
        let cashback = this.cashbackGenerate();
        let cashbackValue = Math.floor((cashback / 100) * formObj.value.valor);

        shopObj.cashbackPorcent = cashback;
        shopObj.cashbackValue = cashbackValue.toLocaleString('pt-BR');
        shopObj.value = moneyValue;
        shopObj.status = "Em análise";
      }

      this.shopServices.add(shopObj).subscribe(
        addShopReturn => {
          //reset all inputs
          this.resetInputs();

          //update the list of shops
          this.shopList();

          //close modal
          document.getElementById("closeModalShop").click();

          //get alert to inform a user
          this.toastr.success('Em seguida, deverá ser aprovada pelo administrador para que seu cashback comece a valer para a próxima compra!', 'COMPRA REGISTRADA!');
        },
        err => {
          this.toastr.error('Houve algum erro. Por favor, contate o administrador do sistema!', 'COMPRA NÃO REGISTRADA!');
          console.log("erro", err.message);
        }
      )
    }
  }

  /**
   * The function return the object of user logged
   * @author Wagner Castilho
   *
   */
  getUserFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
  }

  /**
    * The function get a value input on html and discount a cashback value avaible
    * @author Wagner Castilho
    *
    * @params shopValue - a value from input of html
    */
  useCashback(shopValue) {
    this.valueCashbackApplicated = (parseFloat(shopValue.substring(3, 20).split(".").join("").replace(",", ".")) - this.valueCashbackDiscount).toLocaleString("pt-BR");
  }

  /**
   * The function set a variable to show a caskback discount
   * @author Wagner Castilho
   *
   * @params shopList - contains a all registers from shop database
   */
  getCashbackDiscount(shopList) {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
    let objFiltered = shopList.filter(f => f.idUser == user.id);

    this.shopListApproveds = objFiltered.filter(f => f.status == "Aprovado");
    let shopApprovedList = this.shopListApproveds;

    if (shopApprovedList.length > 0) {
      this.haveCashback = true;
      let filteredValuesCashback = shopApprovedList.map(m => m.cashbackValue);
      for (var i = 0; i < filteredValuesCashback.length; i++) {
        if (filteredValuesCashback[i].includes(",")) {
          this.valueCashbackDiscount += parseFloat(filteredValuesCashback[i].split(".").join("").replace(",", "."));
        } else {
          let addDecimalCase = filteredValuesCashback[i] + ",00";
          this.valueCashbackDiscount += parseFloat(addDecimalCase.split(".").join("").replace(",", "."));
        }
      }
      this.valueCashbackDiscountDisplay = this.valueCashbackDiscount.toLocaleString("pt-BR");
    } else {
      this.haveCashback = false;
    }
  }

  /**
   * The function set a inactive register in shop database
   * @author Wagner Castilho
   *
   */
  setInactiveShopRegister() {
    let ids = this.shopListApproveds.map(m => m.id);

    for (var i = 0; i < ids.length; i++) {
      let actualShopList = this.shopListApproveds.filter(f => f.id == ids[i])[0];
      let shopObj: ShopModel = new ShopModel;
      shopObj.id = actualShopList.id;
      shopObj.code = actualShopList.code;
      shopObj.date = actualShopList.date;
      shopObj.status = "Inativo";
      shopObj.idUser = actualShopList.idUser;
      shopObj.value = actualShopList.value;
      shopObj.cashbackValue = actualShopList.cashbackValue;
      shopObj.cashbackPorcent = actualShopList.cashbackPorcent;

      this.shopServices.updateStatus(shopObj, ids[i]).subscribe(
        returnUpdate => {
          this.toastr.success("Status do registro atualizado com sucesso", "Atualizado!");
        },
        err => {
          this.toastr.error("Erro ao atualizar o status do item de compra. Contate o administrador.", "Ops...");
          console.log("error", err.message);
        }
      )
    }
  }

  /**
   * The function reset all inputs from modal
   * @author Wagner Castilho
   *
   */
  resetInputs() {
    document.getElementById("inputCode")['value'] = "";
    document.getElementById("inputDate")['value'] = "";
    document.getElementById("inputValue")['value'] = "";
    this.valueCashbackDiscountDisplay = "";
    this.valueCashbackApplicated = "";
  }

  /**
   * The function generate a random refund 
   * of up to 50% over the purchase price
   * @author Wagner Castilho
   *
   * @return a random numeric cashback in porcent
   */
  cashbackGenerate() {
    return Math.floor(Math.random() * 50) + 1;
  }
}