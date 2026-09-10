import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicNav } from './public-nav';

describe('PublicNav', () => {
  let component: PublicNav;
  let fixture: ComponentFixture<PublicNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNav],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
