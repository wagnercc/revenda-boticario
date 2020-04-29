import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoginService {
  private readonly API = 'http://localhost:3000/users';

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  //Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  login(user: User) {
    this.listUsers().subscribe(
      shopListReturn => {
        let checkEmailExist = shopListReturn.find(f => f.email == user.email);
        if (checkEmailExist == undefined) {
          this.toastr.error('Não encontramos nenhum registro relacionado a este email!', 'Ops...');
        } else {
          if (checkEmailExist.password === user.password) {
            user.id = checkEmailExist.id;
            user.name = checkEmailExist.name;
            user.cpf = checkEmailExist.cpf;
            user.isAdmin = checkEmailExist.isAdmin;
            sessionStorage.setItem('currentUser', JSON.stringify(user));

            this.currentUserSubject.next(user);
            this.router.navigate(['/']);
          } else {
            this.toastr.error('Sua senha não está certa, tente novamente!', 'Ops...');
            this.currentUserSubject.next(null);
            this.router.navigate(['/login']);
          }
        }

      }
    )
  }

  logout() {
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    let currentUser = sessionStorage.getItem('currentUser');
    if (currentUser != null) {
      return JSON.parse(sessionStorage.getItem('currentUser')).isAdmin;
    } else {
      return false;
    }
  }

  /**
   * List all registers from table shop - database
   * @author Wagner Castilho
   *
   */
  listUsers() {
    return this.http.get<User[]>(this.API);
  }

}