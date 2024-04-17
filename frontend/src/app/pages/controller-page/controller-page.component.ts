import { Component, OnDestroy, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { PageService } from '../service/page.service';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { NewOrder, Order } from '../../shared/models/shared-models';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-controller-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './controller-page.component.html',
  styleUrl: './controller-page.component.scss'
})
/**
 * TODO:
 * Display entered values, let user delete displayed values here.
 */
export class ControllerPageComponent extends BaseComponent implements OnInit {
  orders: Order[];
  displayedColumns: string[] = ['order_number', 'location_id', 'done', 'actions']

  allOrders: Order[] = []
  enteredValue: string = ''

  dataSource: MatTableDataSource<Order>


  orderNumber: string
  locationId: number
  done: boolean = false
  

  constructor(private pageService: PageService,
    private router: Router,
    private sharedService: SharedService
  ) {
    super()
  }
  // @ts-ignore
  ngOnInit(): void {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders

      this.dataSource = new MatTableDataSource(allOrders)
      this.updateDatasource()
    })
  }

  // saveValue() {
  //   if (this.enteredValue.trim() !== '') {
  //     const existingValue = localStorage.getItem('enteredValue') || '';
  //     const newValue = this.enteredValue.trim();
  //     const updatedValue = existingValue ? `${existingValue}\n${newValue}` : newValue;
  //     localStorage.setItem('enteredValue', updatedValue);
  //     this.pageService.setValue(this.enteredValue.trim())
  //     this.enteredValue = '';
  //   }
  // }

  updateDatasource() {
    this.sharedService.getAllOrders().pipe(take(1)).subscribe(allOrders => {
      this.dataSource.data = allOrders
    })
  }

  onSubmit(): void {
    const newOrder: NewOrder = {
      order_number: this.orderNumber,
      location_id: this.locationId,
      done: this.done
    }

    this.sharedService.addOrder(newOrder).subscribe((order: Order) => {
      // Reset form fields after successful submission
      

      if (order) {
        this.updateDatasource()
        this.orderNumber = ''
      }
      
      
    })
  }

  isOrderNumberEmpty(): boolean {
    return !this.orderNumber || /^\s*$/.test(this.orderNumber);
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }
}
