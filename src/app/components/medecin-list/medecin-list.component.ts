import { Component, OnDestroy, OnInit } from '@angular/core';
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
  errorMessage = '';
  private subscription = new Subscription();

  constructor(private readonly medecinService: MedecinService) {}

  ngOnInit(): void {
    this.subscription = this.medecinService.getMedecinsObservable().subscribe(medecins => {
      this.medecins = medecins;
    });

    this.medecinService.refreshMedecins().subscribe({
      error: () => {
        this.errorMessage = 'Impossible de charger les médecins depuis le serveur.';
      }
    });
  }

  supprimerMedecin(id: number): void {
    this.medecinService.deleteMedecin(id).subscribe({
      next: () => {
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression du médecin.';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
