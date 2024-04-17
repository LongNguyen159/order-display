import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location, NewOrder, Order } from '../models/shared-models';
import { Observable } from 'rxjs';

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

  getAllLocations() {
    return this.http.get<Location[]>(`${this._apiEndpoint}/locations/`)
  }


  addOrder(order: NewOrder): Observable<Order> {
    return this.http.post<Order>(`${this._apiEndpoint}/orders/`, order)
  }
}
