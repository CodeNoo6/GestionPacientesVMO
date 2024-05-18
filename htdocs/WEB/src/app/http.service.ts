import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IPatient } from './interface/patient';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = "http://localhost";
  apiUrlCity = "https://vmo-interview-ujaspmx5nq-uc.a.run.app/city";

  http = inject(HttpClient);
  constructor() { }

  getCities() {
    return this.http.get<any[]>(this.apiUrlCity, {
      headers: {
        'Key': 'c2330fce0ce03c10571d888c2a8d7181'
      }
    });
  }

  getAllPatients() {
    return this.http.get<IPatient[]>(this.apiUrl + "/api/patient")
  }

  createPatient(patient: IPatient) {
    return this.http.post(this.apiUrl + "/api/patient", patient);
  }

  getPatient(patientId:number) {
    return this.http.get<IPatient>(this.apiUrl + "/api/patient/" + patientId);
  }

  updatePatient(patientId:number, patient:IPatient) {
    return this.http.put<IPatient>(this.apiUrl + "/api/patient/" + patientId, patient);
  }

  deletePatient(patientId:number) {
    return this.http.delete(this.apiUrl + "/api/patient/" + patientId);
  }
}
