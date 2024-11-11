import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/residents/residents.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { FormComponent } from '../../pages/form/form.component';
import { ConfirmationDialogComponent } from '../../pages/common/confirmation-dialog/confirmation-dialog.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CertificatesComponent } from '../../pages/certificates/certificates.component';
import { CertificatesFormComponent } from '../../pages/certificates-form/certificates-form.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PrintModalComponent } from '../../pages/common/print-modal/print-modal.component';
import { MultiSelectDropdownComponent } from '../../pages/common/multi-select-dropdown/multi-select-dropdown.component';
import { PurposeModalComponent } from '../../pages/common/purpose-modal/purpose-modal.component';
import { QRModalComponent } from '../../pages/common/qr-modal/qr-modal.component';
import { QrCodeModule } from 'ng-qrcode';
import { HistoryModalComponent } from '../../pages/common/history-modal/history-modal.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { BarangayOfficialsComponent } from '../../pages/barangay-officials/barangay-officials.component';
import { BarangayOfficialsFormComponent } from '../../pages/barangay-officials-form/barangay-officials-form.component';
import { CensusComponent } from '../../pages/census/census.component';
import { CensusFormComponent } from '../../pages/census-form/census-form.component';
import { CensusProfileModalComponent } from '../../pages/common/census-profile-modal/census-profile-modal.component';
import { AnnouncementListComponent } from '../../pages/announcements/announcement-list/announcement-list.component'; // Import Announcements Component

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        EditorModule,
        QrCodeModule,
    ],
    declarations: [
        DashboardComponent,
        UserComponent,
        TableComponent,
        IconsComponent,
        ProfileComponent,
        CertificatesComponent,
        CertificatesFormComponent,
        FormComponent,
        ConfirmationDialogComponent,
        PrintModalComponent,
        HistoryModalComponent,
        PurposeModalComponent,
        MultiSelectDropdownComponent,
        QRModalComponent,
        SettingsComponent,
        BarangayOfficialsComponent,
        BarangayOfficialsFormComponent,
        CensusComponent,
        CensusFormComponent,
        CensusProfileModalComponent,
        AnnouncementListComponent // Declare Announcements Component
    ]
})
export class AdminLayoutModule { }
