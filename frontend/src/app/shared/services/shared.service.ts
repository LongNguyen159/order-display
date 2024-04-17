import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location, NewOrder, Order } from '../models/shared-models';
import { Observable } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  /** TODO: change this IP to router static IP.
   * The server should be accessible for all devices within the same network
   */
  private _apiEndpoint: string = `http://127.0.0.1:8000`


  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }


  getAllOrders() {
    return this.http.get<Order[]>(`${this._apiEndpoint}/orders/`)
  }

  getAllLocations() {
    return this.http.get<Location[]>(`${this._apiEndpoint}/locations/`)
  }

  createLocation(description: string) {
    const postData =  {
      description: description
    }
    return this.http.post(`${this._apiEndpoint}/locations/`, postData)
  }

  removeLocation(id: number) {
    return this.http.delete(`${this._apiEndpoint}/locations/${id}`)
  }


  addOrder(order: NewOrder): Observable<Order> {
    return this.http.post<Order>(`${this._apiEndpoint}/orders/`, order)
  }

  updateOrderDone(id: number, done: boolean): Observable<boolean> {
    const url = `${this._apiEndpoint}/orders/${id}/?done=${done}`;
    return this.http.patch<boolean>(url, {}, {})
  }

  /** Remove when user click on column 'Picked up'.
   * Because when customers have picked up their orders, then delete them from database makes sense.
   */
  removeOrder(id: number) {
    return this.http.delete(`${this._apiEndpoint}/orders/${id}`)
  }

  openSnackbar(message: string, position = 'bottom') {
    this.snackbar.open(message, 'Dismiss', {
      verticalPosition: position as MatSnackBarVerticalPosition,
      duration: 2500
    })
  }
}
