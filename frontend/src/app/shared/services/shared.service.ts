import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location, NewOrder, Order } from '../models/shared-models';
import { Observable, switchMap, timer } from 'rxjs';
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
   * The server should be accessible for all devices within the same network.
   * 
   * TODO Deployment:
   * - Configure a static IP on router for the server. In this case, take one laptop as a server.
   * 
   * Run `ng serve` with the server's static IP.
   * example: `ng serve --host 192.169.0.10`
   * 
   * ALTERNATIVELY, WE CAN GET THE HOSTNAME OF THE SERVER, instead of static IP (which comes with cost)
   * - change 'longs-macbook.local' to the hostname of the laptop that acts as server later.
   * - run commend `ng serve --host=`
   */
  private _apiEndpoint: string = `http://longs-macbook.local:8000`

  /** Polling interval in miliseconds. 1000ms = 1s */
  private _pollingInterval: number = 5000

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

  // getLocalIpAddress(): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const pc = new RTCPeerConnection();
  //     pc.createDataChannel('');

  //     pc.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         const sdpLines = event.candidate.candidate.split('\n');
  //         const ipLine = sdpLines.find(line => line.startsWith('a=candidate'));

  //         if (ipLine) {
  //           const ipAddress = ipLine.split(' ')[4];
  //           resolve(ipAddress);
  //         }
  //       }
  //     };

  //     pc.createOffer()
  //       .then(offer => pc.setLocalDescription(offer))
  //       .catch(error => reject(error));
  //   });
  // }

  /** Poll results  */
  getAllOrders() {
    // return timer(1, this._pollingInterval).pipe(
    //   // Use switchMap to switch to a new observable each time interval emits a value
    //   switchMap(() => this.http.get<Order[]>(`${this._apiEndpoint}/orders/`))
    // )
    return this.http.get<Order[]>(`${this._apiEndpoint}/orders/`)
  }

  getAllLocations() {
    // return timer(1, this._pollingInterval).pipe(
    //   // Use switchMap to switch to a new observable each time interval emits a value
    //   switchMap(() => this.http.get<Location[]>(`${this._apiEndpoint}/locations/`))
    // )
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
