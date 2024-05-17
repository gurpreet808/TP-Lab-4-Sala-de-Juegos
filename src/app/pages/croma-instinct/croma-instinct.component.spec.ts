import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CromaInstinctComponent } from './croma-instinct.component';

describe('CromaInstinctComponent', () => {
  let component: CromaInstinctComponent;
  let fixture: ComponentFixture<CromaInstinctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CromaInstinctComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CromaInstinctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
