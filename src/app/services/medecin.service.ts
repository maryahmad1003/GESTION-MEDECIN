import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Medecin } from '../models/medecin';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private apiUrl = 'http://localhost:3001/api/medecins';
  private medecinsSubject = new BehaviorSubject<Medecin[]>([]);

  constructor(private http: HttpClient) {
    this.loadMedecins();
  }

  private loadMedecins(): void {
    this.http.get<Medecin[]>(this.apiUrl).subscribe({
      next: (data) => this.medecinsSubject.next(data),
      error: () => this.medecinsSubject.next([])
    });
  }

  addMedecin(medecin: Medecin): Observable<Medecin> {
    return this.http.post<Medecin>(this.apiUrl, {
      ...medecin,
      id: undefined
    }).pipe(
      tap(() => this.loadMedecins())
    );
  }

  getMedecins(): Medecin[] {
    return this.medecinsSubject.value;
  }

  getMedecinsObservable() {
    return this.medecinsSubject.asObservable();
  }
}
