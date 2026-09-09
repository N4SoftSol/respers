import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Individuals } from './individuals';

describe('Individuals', () => {
  let component: Individuals;
  let fixture: ComponentFixture<Individuals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Individuals],
    }).compileComponents();

    fixture = TestBed.createComponent(Individuals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
