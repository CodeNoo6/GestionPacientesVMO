import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';

export const routes: Routes = [
    {
        path:"",
        component: PatientListComponent
    },
    {
        path:"patient-list",
        component: PatientListComponent
    },
    {
        path:"create-patient",
        component: PatientFormComponent
    },
    {
        path:"patient/:id",
        component: PatientFormComponent
    },
];
