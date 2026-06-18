import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../services/medecin.service';

@Component({
  selector: 'app-medecin-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medecin-form.component.html',
  styleUrls: ['./medecin-form.component.css']
})
export class MedecinFormComponent implements OnInit {
  medecin: Medecin = this.createEmptyMedecin();
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly medecinService: MedecinService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.isEditing = true;
    this.medecinService.getMedecin(id).subscribe({
      next: medecin => {
        this.medecin = medecin;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger ce médecin.';
      }
    });
  }

  enregistrerMedecin(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const request = this.isEditing
      ? this.medecinService.updateMedecin({ ...this.medecin })
      : this.medecinService.addMedecin({ ...this.medecin });

    request.subscribe({
      next: () => {
        this.errorMessage = '';

        if (this.isEditing) {
          this.router.navigate(['/liste']);
          return;
        }

        this.successMessage = 'Médecin enregistré avec succès !';
        this.medecin = this.createEmptyMedecin();
        form.resetForm(this.medecin);

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = this.isEditing
          ? 'Erreur lors de la modification du médecin.'
          : "Erreur lors de l'ajout du médecin.";
      }
    });
  }

  annulerEdition(form: NgForm): void {
    this.medecin = this.createEmptyMedecin();
    this.successMessage = '';
    this.errorMessage = '';
    form.resetForm(this.medecin);

    if (this.isEditing) {
      this.router.navigate(['/liste']);
    }
  }

  incrementExperience(): void {
    this.medecin.experience = Math.max(0, Number(this.medecin.experience || 0) + 1);
  }

  decrementExperience(): void {
    this.medecin.experience = Math.max(0, Number(this.medecin.experience || 0) - 1);
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
      experience: null as unknown as number,
      disponibilite: ''
    };
  }
}
