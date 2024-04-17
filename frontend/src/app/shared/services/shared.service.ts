import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/shared-models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  /** TODO: change this IP to router static IP.
   * The server should be accessible for all devices within the same network
   */
  private _apiEndpoint: string = `http://127.0.0.1:8000`


  constructor(private http: HttpClient) { }


  getAllOrders() {
    return this.http.get<Order[]>(`${this._apiEndpoint}/orders/`)
  }
}
