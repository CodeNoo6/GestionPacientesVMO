import { Component, inject } from '@angular/core';
import { IPatient } from '../../interface/patient';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent {
  patientList: IPatient[] = [];
  cities: any[] = []; 
  router = inject(Router);
  httpService=inject(HttpService);
  showAgeColumn: boolean = true;
  toaster = inject(ToastrService);
  displayedColumns: string[] = ['DNI', 'Nombre', 'Apellido', 'CorreoElectronico', 'Telefonos', 'FechaNacimiento', 'Direccion', 'CiudadID', 'Edad', 'Operaciones'];
  
  constructor() {
    const showAgeColumnStorage = localStorage.getItem('showAgeColumn');
    if (showAgeColumnStorage !== null) {
      this.showAgeColumn = JSON.parse(showAgeColumnStorage);
    }
  }

  toggleAgeColumnVisibility() {
    this.showAgeColumn = !this.showAgeColumn;
    localStorage.setItem('showAgeColumn', JSON.stringify(this.showAgeColumn));
  }

  ngOnInit(): void {
    this.getEmployeeFromServer();
    this.getCities();
  }

  getCities(): void {
    this.httpService.getCities().subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(city => city.city_id == cityId);
    return city ? city.name : 'Ciudad Desconocida';
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getEmployeeFromServer(){
    this.httpService.getAllPatients().subscribe((result) => {
      this.patientList = result;
      console.log(this.patientList);
    })
  }

  edit(id:number) {
    console.log(id);
    this.router.navigateByUrl("/patient/" + id)
  }

  delete(id:number) {
    this.httpService.deletePatient(id).subscribe(() => {
      console.log(id);
      this.patientList = this.patientList.filter(x=>x.id!=id);
      this.getEmployeeFromServer();
      this.toaster.success("Registro eliminado exitosamente.");
    });
  }
}
