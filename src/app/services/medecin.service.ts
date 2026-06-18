import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { Medecin } from '../models/medecin';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private readonly apiUrl = this.resolveApiUrl();
  private readonly medecinsSubject = new BehaviorSubject<Medecin[]>([]);

  constructor(private readonly http: HttpClient) {}

  refreshMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(this.apiUrl).pipe(
      map(medecins => medecins.map(medecin => this.normalizeMedecin(medecin))),
      tap(medecins => this.medecinsSubject.next(medecins))
    );
  }

  getMedecinsObservable(): Observable<Medecin[]> {
    return this.medecinsSubject.asObservable();
  }

  getMedecins(): Medecin[] {
    return this.medecinsSubject.value.map(medecin => this.cloneMedecin(medecin));
  }

  getMedecin(id: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.apiUrl}/${id}`).pipe(
      map(medecin => this.normalizeMedecin(medecin))
    );
  }

  addMedecin(medecin: Medecin): Observable<Medecin> {
    const payload = this.preparePayload(medecin, false);

    return this.http.post<Medecin>(this.apiUrl, payload).pipe(
      map(savedMedecin => this.normalizeMedecin(savedMedecin)),
      tap(savedMedecin => {
        this.medecinsSubject.next([...this.medecinsSubject.value, savedMedecin]);
      })
    );
  }

  updateMedecin(medecin: Medecin): Observable<Medecin> {
    const payload = this.preparePayload(medecin, true);

    return this.http.put<Medecin>(`${this.apiUrl}/${medecin.id}`, payload).pipe(
      map(updatedMedecin => this.normalizeMedecin(updatedMedecin)),
      tap(updatedMedecin => {
        const nextMedecins = this.medecinsSubject.value.map(currentMedecin =>
          currentMedecin.id === updatedMedecin.id ? updatedMedecin : currentMedecin
        );
        this.medecinsSubject.next(nextMedecins);
      })
    );
  }

  deleteMedecin(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.medecinsSubject.next(this.medecinsSubject.value.filter(medecin => medecin.id !== id));
      })
    );
  }

  private resolveApiUrl(): string {
    if (typeof window === 'undefined') {
      return '/api/medecins';
    }

    return window.location.port === '4200'
      ? 'http://localhost:3001/api/medecins'
      : '/api/medecins';
  }

  private preparePayload(medecin: Medecin, keepCode: boolean): Medecin {
    return {
      ...this.normalizeMedecin(medecin),
      code: keepCode ? this.normalizeText(medecin.code) : ''
    };
  }

  private normalizeMedecin(medecin: Medecin): Medecin {
    return {
      ...medecin,
      id: Number(medecin.id) || 0,
      matricule: this.normalizeText(medecin.matricule),
      code: this.normalizeText(medecin.code),
      nom: this.normalizeText(medecin.nom),
      prenom: this.normalizeText(medecin.prenom),
      sexe: medecin.sexe,
      specialite: this.normalizeText(medecin.specialite),
      telephone: this.normalizeText(medecin.telephone),
      email: this.normalizeText(medecin.email),
      experience: this.normalizeExperience(medecin.experience),
      disponibilite: medecin.disponibilite
    };
  }

  private normalizeExperience(value: number): number {
    const experience = Number(value);
    return Number.isFinite(experience) && experience >= 0 ? experience : 0;
  }

  private normalizeText(value: string): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private cloneMedecin(medecin: Medecin): Medecin {
    return { ...medecin };
  }
}
