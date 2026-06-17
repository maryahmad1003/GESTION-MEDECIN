import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../services/medecin.service';

@Component({
  selector: 'app-medecin-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medecin-form.component.html',
  styleUrls: ['./medecin-form.component.css']
})
export class MedecinFormComponent {
  medecin: Medecin = this.createEmptyMedecin();

  constructor(
    private medecinService: MedecinService,
    private router: Router
  ) {}

  ajouterMedecin(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.medecinService.addMedecin({ ...this.medecin }).subscribe({
      next: () => {
        this.medecin = this.createEmptyMedecin();
        form.resetForm(this.medecin);
        this.router.navigate(['/liste']);
      },
      error: (err) => console.error('Erreur lors de l\'ajout du médecin', err)
    });
  }

  private createEmptyMedecin(): Medecin {
    return {
      id: 0,
      matricule: '',
      code: '',
      nom: '',
      prenom: '',
      sexe: '',
      specialite: '',
      telephone: '',
      email: '',
      experience: 0,
      disponibilite: ''
    };
  }
}
