import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy {

  protected sharedService = inject(SharedService)
  protected componentDestroyed$ = new Subject<void>()


  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next()
    this.componentDestroyed$.complete()
    this.sharedService.closeWebsocket()
  }

}
