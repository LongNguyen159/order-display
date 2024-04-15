import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerPageComponent } from './controller-page.component';

describe('ControllerPageComponent', () => {
  let component: ControllerPageComponent;
  let fixture: ComponentFixture<ControllerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
