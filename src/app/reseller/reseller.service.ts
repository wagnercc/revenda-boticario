import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class ResellerService {

  private readonly API = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  //Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  /**
   * Add a new register on shop - database
   * @author Wagner Castilho
   *
   * @params obj - contains a obj to add in DB
   */
  add(obj: User) {
    return this.http.post<User>(this.API, JSON.stringify(obj), this.httpOptions);
  }

  /**
   * List all registers from table shop - database
   * @author Wagner Castilho
   *
   */
  list() {
    return this.http.get<User[]>(this.API);
  }

  /**
   * List of specific user using id as param
   * @author Wagner Castilho
   *
   * @params id - a id of user
   */
  getUserById(id) {
    return this.http.get<User>(this.API + "/" + id);
  }

  /**
   * Delete specify id from shop - database
   * @author Wagner Castilho
   *
   * @params id - contains a id of register to delete in database
   */
  delete(id) {
    return this.http.delete(this.API + '/' + id, this.httpOptions);
  }
}