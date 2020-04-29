import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShopModel } from './shopModel';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly API = 'http://localhost:3000/shop';

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
  add(obj: ShopModel) {
    return this.http.post<ShopModel>(this.API, JSON.stringify(obj), this.httpOptions);
  }

  /**
  * Set a status register to inactive
  * @author Wagner Castilho
  *
  * @params obj - contains a obj to update
  * @params id - contain a id to update
  */
  updateStatus(obj: ShopModel, id) {
    return this.http.put(this.API + '/' + id, obj, this.httpOptions)
  }

  /**
   * List all registers from table shop - database
   * @author Wagner Castilho
   *
   */
  list() {
    return this.http.get<ShopModel[]>(this.API);
  }

  /**
   * List a register by specific id
   * @author Wagner Castilho
   *
   * @params id specific of shop register
   */
  listById(id) {
    return this.http.get<ShopModel[]>(this.API + "/" + id);
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
