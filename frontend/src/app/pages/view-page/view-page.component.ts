import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../shared/components/base/base.component';
import { Location, Order } from '../../shared/models/shared-models';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './view-page.component.html',
  styleUrl: './view-page.component.scss'
})

/**
 * TODO:
 * - filter based on location here. Idea: make a bar above stating which 
 * location this is. (also selectable dropdown)
 */
export class ViewPageComponent extends BaseComponent implements OnInit, OnDestroy {
  allOrders: Order[] = []
  filteredOrderByLocation: Order[] = []
  filterLocationId: number = 0

  readyToPickupOrders: Order[] = []
  preparingOrders: Order[] = []

  locations: Location[] = []

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

    this.sharedService.getAllLocations().pipe(takeUntil(this.componentDestroyed$)).subscribe(locations => {
      this.locations = locations
    })

    /** Connect to websocket */
    // this.sharedService.connectToWebsocket().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {

    // })
    // this.sharedService.connectWebsocket()

    /** Get websocket data */
    this.sharedService.getWebsocketData().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {
      if (data) {
        console.log('view page received websocket message')
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
    this.filterOrderType()
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
