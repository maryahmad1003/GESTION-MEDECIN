import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MedecinFormComponent } from './medecin-form.component';

describe('MedecinFormComponent', () => {
  let component: MedecinFormComponent;
  let fixture: ComponentFixture<MedecinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinFormComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MedecinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
