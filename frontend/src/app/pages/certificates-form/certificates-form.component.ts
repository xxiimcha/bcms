import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarangayDocument } from '../../model/BarangayDocument.model';
import { ApiService } from '../../services/api.service';


@Component({
    selector: 'certificates-form-cmp',
    moduleId: module.id,
    templateUrl: 'certificates-form.component.html'
})

export class CertificatesFormComponent implements OnInit{

    certificate: BarangayDocument = {
        id: 0,
        certificate_type: '',
        certificate_value: ''
    };

    certificateId: number = 0;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private route: ActivatedRoute
    ) { 
        this.route.params.subscribe(params => {
            this.certificateId = params['id'];
        });
    }

    ngOnInit() {
        this.apiService.getDocumentById(this.certificateId).subscribe(response => {
            if(response) {
                this.certificate = response
            }
        });
    }

    saveCertificate() {
        if(this.certificateId) {
            this.apiService.updateDocument(this.certificate).subscribe(
                () => {
                    this.router.navigate(['app/certificates']);
                }
            );
        } else {
            this.apiService.saveDocument(this.certificate).subscribe(
                () => {
                    this.router.navigate(['app/certificates']);
                }
            );
        }
    }
}
