import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { PageService } from '../service/page.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-controller-page',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './controller-page.component.html',
  styleUrl: './controller-page.component.scss'
})
/**
 * TODO:
 * Display entered values, let user delete displayed values here.
 */
export class ControllerPageComponent implements OnInit, OnDestroy {
  enteredValue: string = '';

  valueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private pageService: PageService) {}
  ngOnInit(): void {
    
  }

  saveValue() {
    if (this.enteredValue.trim() !== '') {
      const existingValue = localStorage.getItem('enteredValue') || '';
      const newValue = this.enteredValue.trim();
      const updatedValue = existingValue ? `${existingValue}\n${newValue}` : newValue;
      localStorage.setItem('enteredValue', updatedValue);
      this.pageService.setValue(this.enteredValue.trim())
      this.enteredValue = ''; // Clear the input field
    }
  }

  ngOnDestroy(): void {
    
  }
}
