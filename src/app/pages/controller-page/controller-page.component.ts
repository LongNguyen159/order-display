import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PageService } from '../service/page.service';

@Component({
  selector: 'app-controller-page',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './controller-page.component.html',
  styleUrl: './controller-page.component.scss'
})
export class ControllerPageComponent implements OnInit, OnDestroy {
  enteredValue: string = '';

  valueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private pageService: PageService) {}
  ngOnInit(): void {
    
  }

  saveValue() {
    if (this.enteredValue.trim() !== '') {
      localStorage.setItem('enteredValue', this.enteredValue.trim());
      this.pageService.setValue(this.enteredValue.trim())
      this.enteredValue = ''; // Clear the input field
    }
  }

  ngOnDestroy(): void {
    
  }
}
