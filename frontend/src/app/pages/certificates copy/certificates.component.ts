import { Component, OnInit } from '@angular/core';
import { BarangayResident } from '../../model/BarangayResident.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'certificates-cmp',
    moduleId: module.id,
    templateUrl: 'certificates.component.html'
})

export class CertificatesComponent implements OnInit{
    barangayResidents: BarangayResident[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isConfirmationVisible: boolean = false;

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadResidents();
    }

    loadResidents() {
        this.apiService.getResidents().subscribe(residents => {
            this.barangayResidents = residents;
        });
    }

    viewCertificateDetails(resident: BarangayResident) {
        if (this.router) {
            this.router.navigate(['app/residents/profile', resident.id]);
        }
    }
}
