import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimateTestComponent } from './animate-test.component';

describe('AnimateTestComponent', () => {
  let component: AnimateTestComponent;
  let fixture: ComponentFixture<AnimateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimateTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
