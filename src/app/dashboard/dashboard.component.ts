import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ShopService } from '../shop/shop.service';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { ResellerService } from '../reseller/reseller.service';
import { UserCashback } from './userCashback';
import { User } from '../login/user';
import { ShopModel } from '../shop/shopModel';

@Component({
  selector: 'revenda-boticario-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor(private shopService: ShopService,
    private loginService: LoginService,
    private userService: ResellerService,
    private toastr: ToastrService) { }

  // Início Declaração de variáveis
  barChartOptions: ChartOptions;
  barChartLabels: Label[];
  barChartType: ChartType;
  barChartLegend;
  barChartPlugins = [];
  barChartData: ChartDataSets[];
  chartReady: boolean = false;
  containCashback: boolean = true;
  cashbacksApproved: number = 0;
  cashbacksRepproved: number = 0;
  cashbacksHold: number = 0;
  isAdmin: boolean = false;
  listUserCashbacks: UserCashback[] = [];
  p: number;
  // Fim Declaração de variáveis

  ngOnInit() {
    this.isAdmin = this.checkIsAdmin();
    if (this.isAdmin) {
      this.getCashbackUsers();
    } else {
      this.generateChartCashback();
    }
  }

  /**
  * This function approve or repprove a cashback
  * @author Wagner Castilho
  *
  * @params action - if a string that can be for approved or repprove
  * @params id - contain a id to update
  */
  approveRepproveCashback(action, id) {
    this.shopService.listById(id).subscribe(
      (returnUserSpecific: ShopModel[]) => {
        let objShop = new ShopModel;
        objShop.id = returnUserSpecific['id'];
        objShop.code = returnUserSpecific['code'];
        objShop.idUser = returnUserSpecific['idUser'];
        objShop.value = returnUserSpecific['value'];
        objShop.date = returnUserSpecific['date'];
        objShop.cashbackValue = returnUserSpecific['cashbackValue'];
        objShop.cashbackPorcent = returnUserSpecific['cashbackPorcent'];

        if (action == "aprovar") {
          objShop.status = "Aprovado";
        } else {
          objShop.status = "Reprovado";
        }

        this.shopService.updateStatus(objShop, returnUserSpecific['id']).subscribe(
          returnUpdate => {
            this.getCashbackUsers();
            if (action == "aprovar") {
              this.toastr.success("O cashback foi aprovado", "Aprovado");
            } else {
              this.toastr.success("O cashback foi reprovado", "Reprovado");
            }
          },
          err => {
            this.toastr.success("Ocorreu um erro na hora de atualizar o cashback. Contate o administrador!", "Ops!")
            console.log("erro", err.message);
          }
        )
      }
    );
  }

  /**
  * This get a specific user to cashback pending approval
  * @author Wagner Castilho
  *
  * @params objShop - is a obj from shop database
  */
  getUsersCashbacks(objShop) {
    this.listUserCashbacks = []
    for (var i = 0; i < objShop.length; i++) {
      let userCashback: UserCashback = new UserCashback;
      let objShopActual = objShop[i];
      this.userService.getUserById(objShopActual.idUser).subscribe(
        (returnUserSpecific: User) => {
          userCashback.idCashback = objShopActual.id;
          userCashback.cpf = returnUserSpecific.cpf;
          userCashback.cashbackValue = objShopActual.cashbackValue.toLocaleString('pt-BR');
        }
      );
      this.listUserCashbacks.push(userCashback);
    }

  }

  /**
  * This get all cashbacks pending approval
  * @author Wagner Castilho
  *
  */
  getCashbackUsers() {
    this.shopService.list().subscribe(
      returnShopList => {
        let shopListFiltered = returnShopList.filter(f => f.status == "Em análise");
        this.getUsersCashbacks(shopListFiltered);
        this.getCountCashbacks(returnShopList);
      }
    )
  }

  /**
  * This function filter a cashbacks to show in html
  * @author Wagner Castilho
  *
  * @params obj - contain a all registers from table shop
  */
  getCountCashbacks(obj) {
    this.cashbacksApproved = obj.filter(f => f.status == "Aprovado").length
    this.cashbacksRepproved = obj.filter(f => f.status == "Reprovado").length
    this.cashbacksHold = obj.filter(f => f.status == "Em análise").length
  }

  /**
  * Check if actual user is admin
  * @author Wagner Castilho
  *
  */
  checkIsAdmin() {
    return this.loginService.isAdmin();
  }

  /**
  * Generate a chart of cashback
  * @author Wagner Castilho
  *
  */
  generateChartCashback() {
    let shopList = [];
    this.shopService.list().subscribe(
      returnShopList => {
        let tempShopList = [];
        this.getCountCashbacks(returnShopList);
        let userSession = JSON.parse(sessionStorage.getItem('currentUser'));
        tempShopList = returnShopList.filter(f => f.idUser == userSession.id).filter(f => f.status == "Aprovado");
        if (tempShopList.length > 0) {
          for (let shopItem in tempShopList) {
            shopList.push(
              {
                cashbackValue: parseInt(tempShopList[shopItem].cashbackValue),
                date: tempShopList[shopItem].date
              })
          }
          this.barChartOptions = {
            responsive: true,
            title: {
              display: true,
              text: 'Gráfico de Cashback(s) Aprovado(s)',
              fontColor: 'white',
              fontSize: 14
            },
            legend: {
              labels: {
                fontColor: "white",
              }
            },
            scales: {
              yAxes: [{
                gridLines: {
                  display: false,
                  color: "white"
                },
                ticks: {
                  fontColor: "white",
                }
              }],
              xAxes: [{
                ticks: {

                  fontColor: "white",
                }
              }],
            }
          },
            this.barChartLabels = shopList.map(({ date }) => date);

          if (shopList.length > 1) {
            this.barChartType = 'line';
            this.barChartData = [
              { data: shopList.map(({ cashbackValue }) => cashbackValue), label: 'Cashback', backgroundColor: 'rgba(226, 96, 67, 0.2)', borderColor: 'rgba(226, 96, 67, 1)', hoverBackgroundColor: '#b74b33' }
            ]
          } else {
            this.barChartType = 'bar';
            this.barChartData = [
              { data: shopList.map(({ cashbackValue }) => cashbackValue), label: 'Cashback', backgroundColor: 'rgba(226, 96, 67, 1)', borderColor: 'rgba(226, 96, 67, 1)', hoverBackgroundColor: '#b74b33' }
            ]
          }

          this.barChartLegend = true;
          this.chartReady = true;
        } else {
          this.containCashback = false;
        }
      }
    )
  }

}
