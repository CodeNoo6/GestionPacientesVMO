import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IPatient } from '../../interface/patient';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule,
    MatNativeDateModule, MatSelectModule, CommonModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent {
  formBuilder = inject(FormBuilder);
  httpService = inject(HttpService);
  cities: any[] = [];
  router = inject(Router);
  route = inject(ActivatedRoute);
  toaster = inject(ToastrService);
  patientForm = this.formBuilder.group({
    DNI: ['', [Validators.required]],
    Nombre: ['', [Validators.required]],
    Apellido: ['', [Validators.required]],
    CorreoElectronico: ['', [Validators.required, Validators.email]],
    Telefonos: [''],
    FechaNacimiento: ['', [Validators.required]],
    Direccion: [''],
    CiudadID: [0],
  })
  patientId!:number;
  isEdit = false;
  ngOnInit(): void {
    this.httpService.getCities().subscribe(
      (data) => {
        this.cities = data;
      },
      (error) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
    this.patientId = this.route.snapshot.params['id'];
    if (this.patientId) {
      this.isEdit = true;
      this.httpService.getPatient(this.patientId).subscribe(result => {
        console.log(result);
        this.patientForm.patchValue(result);
        const ciudadIdNumero = Number(result.CiudadID);
          this.patientForm.get('CiudadID')?.setValue(ciudadIdNumero);
      })
    }
  }

  save() {
    const patient : IPatient ={
        DNI: this.patientForm.value.DNI!,
        Nombre: this.patientForm.value.Nombre!,
        Apellido: this.patientForm.value.Apellido!,
        CorreoElectronico: this.patientForm.value.CorreoElectronico!,
        Telefonos: this.patientForm.value.Telefonos!,
        FechaNacimiento: new Date(this.patientForm.value.FechaNacimiento!).toISOString().split('T')[0],
        Direccion: this.patientForm.value.Direccion!,
        CiudadID: this.patientForm.value.CiudadID!,
    };
    if (this.isEdit) {
        this.httpService.updatePatient(this.patientId, patient).subscribe(() => {
            console.log("success");
            this.toaster.success("Registro actualizado exitosamente.");
            this.router.navigateByUrl("/patient-list");
        });
    } else {
        this.httpService.createPatient(patient).subscribe(() => {
            console.log("success");
            this.toaster.success("Registro agregado exitosamente.");
            this.router.navigateByUrl("/patient-list");
        });
    }
}

}
