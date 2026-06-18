import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Medecin } from '../models/medecin';
import { MedecinService } from './medecin.service';

describe('MedecinService', () => {
  let service: MedecinService;
  let httpMock: HttpTestingController;

  const createMedecin = (overrides: Partial<Medecin> = {}): Medecin => ({
    id: 0,
    matricule: 'MED-001',
    code: '',
    nom: 'Benali',
    prenom: 'Amine',
    sexe: 'Masculin',
    specialite: 'Cardiologie',
    telephone: '0600000000',
    email: 'amine.benali@clinique.com',
    experience: 5,
    disponibilite: 'Disponible',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedecinService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(MedecinService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should start with an empty collection', () => {
    expect(service.getMedecins()).toEqual([]);
  });

  it('should refresh doctors from the backend', async () => {
    const refreshPromise = firstValueFrom(service.refreshMedecins());

    const req = httpMock.expectOne(request => request.url.endsWith('/api/medecins'));
    expect(req.request.method).toBe('GET');
    req.flush([createMedecin({ id: 1, code: 'CP-0001' })]);

    const medecins = await refreshPromise;

    expect(medecins).toHaveLength(1);
    expect(service.getMedecins()[0].code).toBe('CP-0001');
  });

  it('should add a doctor and update the local collection', async () => {
    const addPromise = firstValueFrom(service.addMedecin(createMedecin()));

    const postReq = httpMock.expectOne(request => request.url.endsWith('/api/medecins'));
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body.code).toBe('');
    postReq.flush(createMedecin({ id: 1, code: 'CP-0001' }));

    const stored = await addPromise;

    expect(stored.id).toBe(1);
    expect(stored.code).toBe('CP-0001');
    expect(service.getMedecins().length).toBe(1);
  });

  it('should update and delete a doctor through the backend', async () => {
    const addPromise = firstValueFrom(service.addMedecin(createMedecin()));
    const addReq = httpMock.expectOne('/api/medecins');
    addReq.flush(createMedecin({ id: 1, code: 'CP-0001' }));
    const stored = await addPromise;

    const updatePromise = firstValueFrom(
      service.updateMedecin({
        ...stored,
        nom: 'Sarr',
        prenom: 'Fatou',
        experience: 8
      })
    );

    const putReq = httpMock.expectOne(request => request.url.endsWith('/api/medecins/1'));
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.code).toBe('CP-0001');
    putReq.flush({
      ...stored,
      nom: 'Sarr',
      prenom: 'Fatou',
      experience: 8
    });

    const updated = await updatePromise;

    expect(updated.nom).toBe('Sarr');
    expect(updated.experience).toBe(8);

    const deletePromise = firstValueFrom(service.deleteMedecin(updated.id));
    const deleteReq = httpMock.expectOne(request => request.url.endsWith('/api/medecins/1'));
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    await deletePromise;
    expect(service.getMedecins()).toEqual([]);
  });
});
