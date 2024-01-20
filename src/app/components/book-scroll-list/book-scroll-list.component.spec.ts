import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookScrollListComponent } from './book-scroll-list.component';

describe('BookScrollListComponent', () => {
  let component: BookScrollListComponent;
  let fixture: ComponentFixture<BookScrollListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookScrollListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookScrollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
