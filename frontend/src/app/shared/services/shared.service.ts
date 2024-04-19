import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location, NewOrder, Order } from '../models/shared-models';
import { Observable, Subject, switchMap, timer } from 'rxjs';
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

  private hostname: string = 'longs-macbook.local'

  /** Endpoints */
  private _apiEndpoint: string = `http://${this.hostname}:8000`

  private _websocketEndpoint: string = `ws://${this.hostname}:8000/ws`

  /** Polling interval in miliseconds. 1000ms = 1s */
  private _pollingInterval: number = 99999999

  private _pollingIntervalLong: number = 1000 * 60 * 3 /** Every 3 mins */

  /** Websocket */
  private _ws: WebSocket
  private _socket: WebSocket
  websocketDataSubject: Subject<string> = new Subject<string>()
  websocketClientId: number



  constructor(private http: HttpClient, private snackbar: MatSnackBar) {
    this.connectWebsocket()
  }
  // connectToWebsocket(): Observable<any> {
  //   return new Observable((observer: any) => {
  //     this._ws = new WebSocket(this._websocketEndpoint)
  //     this._ws.onmessage = event => {
  //       // const data: any = JSON.parse(event.data)
  //       console.log(event.data)
  //       this.websocketDataSubject.next(event.data)
  //     }

  //     this._ws.onclose = () => {
  //       observer.complete()
  //     }
  //   })
  // }

  connectWebsocket() {
    this.websocketClientId = Date.now()
    console.log('clientId:', this.websocketClientId)
    this._socket = new WebSocket(`${this._websocketEndpoint}/${this.websocketClientId}`)

    this._socket.onopen = () => {
      console.log('WebSocket connection established')
    };

    this._socket.onmessage = (event) => {
      console.log('Received message:', event.data)
      this.websocketDataSubject.next(event.data)
    }

    this._socket.onclose = (event) => {
      console.log('WebSocket connection closed')
    }

    this._socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  getWebsocketData(): Observable<string> {
    return this.websocketDataSubject.asObservable()
  }

  closeWebsocket() {
    this._socket.close(1000, 'Exit page')
    console.log('closed ID:', this.websocketClientId)
  }


  /** Poll results  */
  getAllOrders() {
    return timer(1, this._pollingInterval).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<Order[]>(`${this._apiEndpoint}/orders/`))
    )
  }

  getAllLocations() {
    return timer(1, this._pollingIntervalLong).pipe(
      // Use switchMap to switch to a new observable each time interval emits a value
      switchMap(() => this.http.get<Location[]>(`${this._apiEndpoint}/locations/`))
    )
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
