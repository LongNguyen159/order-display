import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  value: string = ''
  valueSubject = new BehaviorSubject<string>(this.value)
  constructor() { }


  setValue(value: string) {
    this.value = value
    this.valueSubject.next(this.value)
  }

  getValue() {
    return this.valueSubject.asObservable()
  }
}
