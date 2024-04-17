import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PageService } from '../service/page.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-page.component.html',
  styleUrl: './view-page.component.scss'
})
export class ViewPageComponent implements OnInit, OnDestroy {
  savedValue: string = '';
  valueSubject: BehaviorSubject<string>;
  onDestroy$: Subject<void> = new Subject<void>()

  constructor(private pageService: PageService) {}
  ngOnInit(): void {
    this.pageService.getValue().pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      this.savedValue = localStorage.getItem('enteredValue') || '';
      console.log(this.savedValue)
    })

    window.addEventListener('storage', (event) => {
      console.log(event)
      if (event.key === 'enteredValue') {
        this.savedValue = event.newValue || '';
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }
}
