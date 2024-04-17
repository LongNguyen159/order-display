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
import { Location, NewOrder, Order } from '../../shared/models/shared-models';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../../shared/components/dialog/dialog.component';

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
    MatCheckboxModule,
    CommonModule,
    MatOptionModule,    
  ],
  templateUrl: './controller-page.component.html',
  styleUrl: './controller-page.component.scss'
})
/**
 * TODO:
 * Display entered values, let user delete displayed values here.
 */
export class ControllerPageComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['order_number', 'location_id', 'done', 'actions']

  allOrders: Order[] = []
  locations: Location[] = []



  enteredValue: string = ''


  /** Table Data */
  dataSource: MatTableDataSource<Order>


  /** Form section */
  orderNumber: string
  locationId: number
  done: boolean = false
  

  constructor(private pageService: PageService,
    private router: Router,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    super()
  }
  // @ts-ignore
  ngOnInit(): void {
    this.getAllOrders()
    this.getAllLocations() 
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


  getAllOrders() {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders

      this.dataSource = new MatTableDataSource(allOrders)
      this.updateDatasource()
    })
  }

  getAllLocations() {
    this.sharedService.getAllLocations().pipe(takeUntil(this.componentDestroyed$)).subscribe(locations => {
      this.locations = locations
    })
  }


  updateDatasource() {
    this.sharedService.getAllOrders().pipe(take(1)).subscribe(allOrders => {
      this.dataSource.data = allOrders
    })

    this.sharedService.getAllLocations().pipe(take(1)).subscribe(allLocations => {
      this.locations = allLocations
    })
  }

  onSubmit(): void {
    const newOrder: NewOrder = {
      order_number: this.orderNumber,
      location_id: this.locationId,
      done: this.done
    }

    this.sharedService.addOrder(newOrder).subscribe({
      next: (value: Order) => {
        this.updateDatasource()
        this.orderNumber = ''
        this.sharedService.openSnackbar('Order added successfully!')
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbar('Error adding order, please try again')
      }
    })
  }

  onEnter(): void {
    if (this.isOrderNumberEmpty()) {
      this.sharedService.openSnackbar('Order number cannot be empty!', 'top');
    }
    if (!this.locationId) {
      this.sharedService.openSnackbar('Location cannot be empty!', 'top');
    }

    if (!this.isOrderNumberEmpty && this.locationId) {
      this.onSubmit()
      return
    }
  }

  onDeleteOrder(event: Event, orderId: string) {
    event.stopPropagation()
    this.sharedService.removeOrder(orderId).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.sharedService.openSnackbar(`Order ${orderId} has been picked up!`)
        this.updateDatasource()
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbar(`Error removing ${orderId}, please try again`)
        this.updateDatasource()
      }
    })
  }

  onCreateLocation() {
    this.promptForDescription()
  }

  promptForDescription(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40%',
    })

    dialogRef.afterClosed().subscribe((locationInput: string) => {
      /** call service to create here */
      if (locationInput) {
        this.sharedService.createLocation(locationInput).pipe(take(1)).subscribe({
          next: (value: any) => {
            this.updateDatasource()
            this.sharedService.openSnackbar('New section added!')
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.openSnackbar('Error adding section, please try again')
          }
        })
      } else {
        return
      }
    })
  }
  

  isOrderNumberEmpty(): boolean {
    return !this.orderNumber || /^\s*$/.test(this.orderNumber)
  }

  isLocationEmpty(): boolean {
    return this.locationId == undefined || this.locationId == null
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }
}
