import { Component, OnInit } from '@angular/core';
import { BarangayResident } from '../../model/BarangayResident.model';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { BarangayDocument } from '../../model/BarangayDocument.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'certificates-cmp',
    moduleId: module.id,
    templateUrl: 'certificates.component.html'
})

export class CertificatesComponent implements OnInit{
    barangayDocuments: BarangayDocument[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isConfirmationVisible: boolean = false;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadDocuments();
    }

    loadDocuments() {
        this.apiService.getDocuments().subscribe(document => {
            this.barangayDocuments = document;
        });
    }

    viewCertificateDetails(document: BarangayDocument) {
        if (this.router) {
            this.router.navigate(['app/certificates/form/view', document.id]);
        }
    }

    addCertificate() {
        if (this.router) {
            this.router.navigate(['app/certificates/form/create']);
        }
    }

    deleteCertificate(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteDocument(id).subscribe(res => {
                    if(res) {
                        this.toastr.success('Certificate Record deleted successfully', 'Close');
                        this.loadDocuments();
                    }
                });
            }
        });
    }
}
