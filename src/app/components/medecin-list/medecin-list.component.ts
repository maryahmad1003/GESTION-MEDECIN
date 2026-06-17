import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../services/medecin.service';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medecin-list.component.html',
  styleUrls: ['./medecin-list.component.css']
})
export class MedecinListComponent implements OnInit, OnDestroy {
  medecins: Medecin[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private medecinService: MedecinService) {}

  ngOnInit(): void {
    this.medecins = this.medecinService.getMedecins();

    this.subscription = this.medecinService.getMedecinsObservable().subscribe(medecins => {
      this.medecins = medecins;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
