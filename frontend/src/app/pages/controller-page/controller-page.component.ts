import { Component, OnDestroy, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PageService } from '../service/page.service';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Order } from '../../shared/models/shared-models';

@Component({
  selector: 'app-controller-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule
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
  

  constructor(private pageService: PageService,
    private router: Router,
    private sharedService: SharedService
  ) {
    super()
  }
  // @ts-ignore
  ngOnInit(): void {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      console.log(allOrders)
      this.allOrders = allOrders

      this.dataSource = new MatTableDataSource(this.allOrders)
    })
  }

  saveValue() {
    if (this.enteredValue.trim() !== '') {
      const existingValue = localStorage.getItem('enteredValue') || '';
      const newValue = this.enteredValue.trim();
      const updatedValue = existingValue ? `${existingValue}\n${newValue}` : newValue;
      localStorage.setItem('enteredValue', updatedValue);
      this.pageService.setValue(this.enteredValue.trim())
      this.enteredValue = '';
    }
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }
}
