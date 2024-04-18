import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { PageService } from '../service/page.service';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../shared/components/base/base.component';
import { Order } from '../../shared/models/shared-models';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-page.component.html',
  styleUrl: './view-page.component.scss'
})
export class ViewPageComponent extends BaseComponent implements OnInit, OnDestroy {
  allOrders: Order[] = []
  filteredOrderByLocation: Order[] = []
  filterLocationId: number = 0

  readyToPickupOrders: Order[] = []
  preparingOrders: Order[] = []

  constructor() {
    super()
  }

  // @ts-ignore
  ngOnInit(): void {

    /** Get all orders, listen for polling and apply filter with polled data */
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders
      console.log('OnInit view page:', allOrders)
      this.filterOrderLocation(this.filterLocationId)
      this.filterOrderType()
    })

    /** Connect to websocket */
    this.sharedService.connectToWebsocket().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {

    })

    /** Get websocket data */
    this.sharedService.getWebsocketData().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {
      if (data) {
        this.updateDatasource()
      }
    })
  }

  filterOrderType() {
    this.preparingOrders = this.filteredOrderByLocation.filter(item => !item.done)
    this.readyToPickupOrders = this.filteredOrderByLocation.filter(item => item.done)
  }

  filterOrderLocation(locationId: number) {
    this.filterLocationId = locationId
    if (locationId !== 0) {
      this.filteredOrderByLocation = this.allOrders.filter(order => order.location_id == locationId)  
    } else {
      this.filteredOrderByLocation = this.allOrders
    }
  }


  updateDatasource() {
    this.sharedService.getAllOrders().pipe(take(1)).subscribe(allOrders => {
      this.allOrders = allOrders
      this.filterOrderLocation(this.filterLocationId)
      this.filterOrderType()
      console.log('all orders updated', allOrders)
    })
  }

}
