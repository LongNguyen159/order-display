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

  constructor() {
    super()
  }

  // @ts-ignore
  ngOnInit(): void {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders
      console.log('OnInit view page:', allOrders)
    })
    this.sharedService.connectToWebsocket().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {

    })


    this.sharedService.getWebsocketData().pipe(takeUntil(this.componentDestroyed$)).subscribe(data => {
      if (data) {
        this.updateDatasource()
      }
    })
  }

  updateDatasource() {
    this.sharedService.getAllOrders().pipe(take(1)).subscribe(allOrders => {
      this.allOrders = allOrders
      console.log('all orders updated', allOrders)
    })
  }

}
