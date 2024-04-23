import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../shared/components/base/base.component';
import { Location, Order } from '../../shared/models/shared-models';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule
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
  locationIdToFilter: number = 0

  readyToPickupOrders: Order[] = []
  preparingOrders: Order[] = []

  locations: Location[] = []
  defaultLocationId: number = 0

  constructor() {
    super()
  }

  // @ts-ignore
  ngOnInit(): void {

    const defaultLocationIdString = localStorage.getItem('defaultLocationId')

    if (defaultLocationIdString) {
      this.defaultLocationId = parseInt(defaultLocationIdString)
      this.locationIdToFilter = this.defaultLocationId
    }

    /** Get all orders, listen for polling and apply filter with polled data */
    this.getAllOrders()    

    this.getAllLocations()
   
  }

  getAllOrders() {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders
      console.log('OnInit view page:', allOrders)
      this.filterOrderLocation(this.locationIdToFilter)
      this.filterOrderType()
    })
  }

  getAllLocations() {
    this.sharedService.getAllLocations().pipe(takeUntil(this.componentDestroyed$)).subscribe(locations => {
      this.locations = locations
    })
  }


  /** Prepairing or ready to pick up? */
  filterOrderType() {
    this.preparingOrders = this.filteredOrderByLocation.filter(item => !item.done)
    this.readyToPickupOrders = this.filteredOrderByLocation.filter(item => item.done)
  }


  /** In which Section are these order? */
  filterOrderLocation(locationId: number) {
    this.locationIdToFilter = locationId
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
      this.filterOrderLocation(this.locationIdToFilter)
      this.filterOrderType()
      console.log('all orders updated', allOrders)
    })
  }

  // @ts-ignore
  ngOnDestroy(): void {
    this.sharedService.closeWebsocket()
  }
}
