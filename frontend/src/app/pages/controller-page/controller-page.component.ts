import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { BaseComponent } from '../../shared/components/base/base.component';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Location, NewOrder, Order } from '../../shared/models/shared-models';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { AlertDialogComponent, DialogData } from '../../shared/components/alert-dialog/alert-dialog.component';


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
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './controller-page.component.html',
  styleUrl: './controller-page.component.scss'
})
/**
 * TODO:
 * - Add Date column to database
 * - Implement clear all records button
 */
export class ControllerPageComponent extends BaseComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator
  displayedColumns: string[] = ['order_number', 'location_id', 'done', 'actions']

  allOrders: Order[] = []
  locations: Location[] = []

  updatingDoneStatus: boolean = false /** Boolean flag true when server are patching 'done' value */


  /** Table Data */
  dataSource: MatTableDataSource<Order>

  filteredOrders: Order[] = []
  locationIdToFilter: number = 0


  /** Form section */
  orderNumber: string
  locationId: number
  done: boolean = true

  defaultLocationId: number = 0
  

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    super()
  }
  // @ts-ignore
  ngOnInit(): void {
    this.getAllOrders()
    this.getAllLocations()

    const defaultLocationIdString = localStorage.getItem('defaultLocationId')

    if (defaultLocationIdString) {
      this.defaultLocationId = parseInt(defaultLocationIdString)
      this.locationIdToFilter = this.defaultLocationId
      this.locationId = this.defaultLocationId
    }
  }

  filterOrders(locationId: number) {
    this.locationIdToFilter = locationId
    if (locationId !== 0) {
      this.filteredOrders = this.allOrders.filter(order => order.location_id == locationId)  
      this.dataSource.data = this.filteredOrders
    } else {
      this.dataSource.data = this.allOrders
      this.filteredOrders = this.allOrders
    }
  }


  getAllOrders() {
    this.sharedService.getAllOrders().pipe(takeUntil(this.componentDestroyed$)).subscribe(allOrders => {
      this.allOrders = allOrders

      this.dataSource = new MatTableDataSource(allOrders)
      this.dataSource.paginator = this.paginator

      this.filterOrders(this.locationIdToFilter)
    })
  }

  getAllLocations() {
    this.sharedService.getAllLocations().pipe(takeUntil(this.componentDestroyed$)).subscribe(locations => {
      this.locations = locations
    })
  }

  updateDatasource() {
    this.sharedService.getAllOrders().pipe(take(1)).subscribe(allOrders => {
      this.dataSource.data.splice(0, this.dataSource.data.length)
      this.dataSource.data.push(...this.filteredOrders)
      this.allOrders = allOrders
      this.filterOrders(this.locationIdToFilter)
      this.dataSource.paginator = this.paginator
    })

    this.sharedService.getAllLocations().pipe(take(1)).subscribe(allLocations => {
      this.locations = allLocations
      this.dataSource.paginator = this.paginator
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

  /** Enter order number */
  onEnterOrderNumber(): void {
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

  onDeleteOrder(event: Event, order: Order) {
    event.stopPropagation()
    const orderId = order.id
    const orderNumber = order.order_number
    this.sharedService.removeOrder(orderId).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.sharedService.openSnackbar(`Order ${orderNumber} has been picked up!`)
        this.updateDatasource()
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbar(`Error removing ${orderNumber}, please try again`)
        this.updateDatasource()
      }
    })
  }


  clearDatabase(event: Event) {
    event.stopPropagation()
    const dialogData: DialogData = {
      title: 'Are you sure you want to delete all records?',
      message: `This will clear all data from the database from all booths. Action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      confirmButtonColor: 'warn'
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '40vw',
      data: dialogData
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sharedService.clearAllOrders().pipe(take(1)).subscribe({
          next: (res) => {
            this.updateDatasource()
            this.sharedService.openSnackbar('All records cleared!')
          },
          error: (err: HttpErrorResponse) => {
            this.updateDatasource()
            this.sharedService.openSnackbar(`Error clearing database, please try again`)
          }
        })
      } else {
        return
      }
    })

  }


  onDoneChange(option: MatCheckboxChange, order: Order) {
    console.log(option)
    const checked = option.checked
    const id = option.source.value

    this.sharedService.updateOrderDone(parseInt(id), checked).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.sharedService.openSnackbar(`Order ${order.order_number} updated!`)
        this.updateDatasource()
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
        this.sharedService.openSnackbar(`Error updating order ${order.order_number}, please try again`)
        this.updateDatasource()
      }
    })
  }


  onDefaultLocationSelect(locationChange: MatSelectChange) {
    const locationId = locationChange.value

    /** Update all location IDs to reflect ngModel changes in template. */
    this.locationIdToFilter = locationId
    this.locationId = locationId
    /** Filter orders accordingly after setting default section */
    this.filterOrders(locationId)

    /** Save on local storage */
    localStorage.setItem('defaultLocationId', locationId)
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
            this.sharedService.openSnackbar('New booth added!')
          },
          error: (err: HttpErrorResponse) => {
            this.sharedService.openSnackbar('Error adding booth, please try again')
          }
        })
      } else {
        return
      }
    })
  }

  onClearLocation(event: Event, locationId: number) {
    event.stopPropagation()
    console.log('clear location id:', locationId)
    this.sharedService.removeLocation(locationId).pipe(take(1)).subscribe({
      next: (value: any) => {
        this.updateDatasource()
        this.sharedService.openSnackbar('Booth removed from database!')
      },
      error: (err: HttpErrorResponse) => {
        this.sharedService.openSnackbar('Error removing booth, please try again')
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

  disconnect() {
    this.sharedService.closeWebsocket()
  }
}
