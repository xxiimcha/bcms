import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TableComponent } from '../../pages/residents/residents.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { CertificatesComponent } from '../../pages/certificates/certificates.component';
import { CertificatesFormComponent } from '../../pages/certificates-form/certificates-form.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { BarangayOfficialsComponent } from '../../pages/barangay-officials/barangay-officials.component';
import { BarangayOfficialsFormComponent } from '../../pages/barangay-officials-form/barangay-officials-form.component';
import { CensusComponent } from '../../pages/census/census.component';
import { CensusFormComponent } from '../../pages/census-form/census-form.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard', 
        component: DashboardComponent
    },
    { 
        path: 'residents', 
        component: TableComponent,
    },
    {
        path: 'residents/profile/:mode/:id',
        component: ProfileComponent
    },
    { 
        path: 'certificates', 
        component: CertificatesComponent
    },
    {
        path: 'certificates/form/:mode/:id',
        component: CertificatesFormComponent
    },
    {
        path: 'certificates/form/:mode',
        component: CertificatesFormComponent
    },
    { 
        path: 'settings', 
        component: SettingsComponent
    },
    { 
        path: 'census', 
        component: CensusComponent
    },
    { 
        path: 'census/form', 
        component: CensusFormComponent
    },
    { 
        path: 'census/form/:id', 
        component: CensusFormComponent
    },
    { 
        path: 'brgy-official', 
        component: BarangayOfficialsComponent
    },
    { 
        path: 'brgy-official/form/:id', 
        component: BarangayOfficialsFormComponent
    },
    { 
        path: 'brgy-official/form', 
        component: BarangayOfficialsFormComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];
