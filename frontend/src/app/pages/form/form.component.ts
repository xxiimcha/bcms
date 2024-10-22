import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BarangayResident } from '../../model/BarangayResident.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BarangayDocument } from '../../model/BarangayDocument.model';
import { PrintModalComponent } from '../common/print-modal/print-modal.component';
import { BarangayResidentDocument } from '../../model/BarangayResidentDocument.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { PurposeModalComponent } from '../common/purpose-modal/purpose-modal.component';
import { QRModalComponent } from '../common/qr-modal/qr-modal.component';
import { HistoryModalComponent } from '../common/history-modal/history-modal.component';

@Component({
    selector: 'form-component',
    templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
    @Input() profileData: BarangayResident | any;
    @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
    profileForm: FormGroup;
    cities: any[] = [];
    barangays: any[] = [];
    isSuperAdmin: boolean = false;
    mode: string = "";
    documents: BarangayDocument[] = [];
    selectedDocumentType: string = "";
    selectedDocumentValue: string = "";
    residentDocument: BarangayResidentDocument | undefined;
    residentId: string ="";
    userRole: any = null;

    constructor(
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private modalService: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.userRole = localStorage.getItem('userRole');
        this.route.params.subscribe(params => {
            this.mode = params['mode'];
            this.residentId = params['id'];
        });
        this.profileForm = this.formBuilder.group({
            id: null,
            email: ['', [Validators.required, Validators.email]],
            middle_name: '',
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            gender: '',
            age: '',
            household_count: '',
            birthdate: '',
            civil_status: '',
            contact_number: '',
            place_of_birth: '',
            employed: '',
            occupation: '',
            monthly_salary: '',
            street: '',
            purok: '',
            barangay: [{ value: 'Rosario', disabled: true }],
            city: [{ value: 'Pasig City', disabled: true }],
            zipcode: [{ value: '1609', disabled: true }],
            certificate: '',
            education: ''
        });

        if(this.mode === 'view') {
            this.disableAllExceptCertificate();
        }
    }

    ngOnInit() {
        if (this.profileData) {
            this.initializeForm();
        }
        this.apiService.getDocuments().subscribe(response => {
            if(response) {
                this.documents = response;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['profileData'] && !changes['profileData'].firstChange) {
            this.initializeForm();
            this.initializeNewResidentCertificate();
        }
    }

    private initializeNewResidentCertificate() {
        this.apiService.getResidentsDocumentById(this.residentId).subscribe(response => {
            this.residentDocument = response;
        });
    }

    private initializeForm() {
        this.profileForm.patchValue({
            id: this.profileData!.id,
            email: this.profileData!.email,
            middle_name: this.profileData!.middle_name,
            first_name: this.profileData!.first_name,
            last_name: this.profileData!.last_name,
            gender: this.profileData!.gender,
            age: this.profileData!.age,
            birthdate: this.profileData!.birthdate,
            civil_status: this.profileData!.civil_status,
            household_count: this.profileData!.household_count,
            contact_number: this.profileData!.contact_number,
            place_of_birth: this.profileData!.place_of_birth,
            employed: this.profileData!.employed,
            occupation: this.profileData!.occupation,
            monthly_salary: this.profileData!.monthly_salary,
            street: this.profileData!.street,
            purok: this.profileData!.purok,
            city: this.profileData!.city,
            zipcode: this.profileData!.zipcode,
            education: this.profileData!.education
        });
    }

    disableAllExceptCertificate() {
        Object.keys(this.profileForm.controls).forEach(key => {
            if (key !== 'certificate') {
                this.profileForm.get(key)!.disable();
            }
        });
    }

    submitProfile() {
        this.apiService.updateResident(this.profileForm.value).subscribe(() => {
            if(this.userRole === 'admin') {
                this.router.navigate(['app/residents']);
            } else {
                this.mode = 'view';
            }
        }, error => {
            console.error('Error updating profile:', error);
        });
    }

    editForm() {
        this.mode = 'edit';
        this.profileForm.enable();
    }

    cancelFormEdit() {
        this.mode = 'view';
        this.disableAllExceptCertificate();
    }

    deactivateAccount() {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteResident(this.profileData!.id).subscribe(res => {
                    if(res) {
                        this.router.navigate(['app/residents']);
                    }
                });
            }
        });
    }

    selectedDocument(event: any) {
        const filterDocuments = this.documents.find(r => r.id == event.target.value);
        this.selectedDocumentType = filterDocuments?.certificate_type ?? "";
        this.selectedDocumentValue = filterDocuments?.certificate_value ?? "";
    }

    viewCertificate() {
        const modalRef = this.modalService.open(PrintModalComponent, { size: 'xl', backdrop: 'static', centered: true });
        modalRef.componentInstance.certificateContent = this.residentDocument?.certificate_file;
        modalRef.componentInstance.residentDetail = this.profileData;
        modalRef.componentInstance.residentRequest = this.residentDocument;
    }

    viewCertificateRequestHistory() {
        const modalRef = this.modalService.open(HistoryModalComponent, { size: 'xl', backdrop: 'static', centered: true });
        modalRef.componentInstance.residentId = this.residentId;
    }
    
    requestCertificate() {
        if(this.selectedDocumentType != '') {
            const modalRef = this.modalService.open(PurposeModalComponent, { size: 'small', backdrop: 'static', centered: true });
            modalRef.componentInstance.confirmed.subscribe((result: any) => {
                if (result) {
                    const requestResidentData: BarangayResidentDocument = {
                        resident_id: this.profileData.id,
                        certificate_type: this.selectedDocumentType,
                        certificate_file: this.selectedDocumentValue,
                        id: 0,
                        date_issued: new Date().toLocaleDateString(),
                        purpose: result.purpose != "" ? result.purpose: "whatever legal purpose it may serve",
                        status: this.userRole === 'admin' ? "Completed" : "Requested"
                    }
                    this.apiService.saveResidentsDocument(requestResidentData).subscribe((res) => {
                        this.toastr.success('Resident Document Requested Success', 'Close');
                        this.initializeNewResidentCertificate();
                    }, error => {
                        console.error('Error updating profile:', error);
                    });
                }
            });
        } else {
            this.toastr.error('Please select certificate', 'Close');
        }
    }

    generateQRCode() {
        this.modalService.open(QRModalComponent, { size: 'lg', backdrop: 'static', centered: true });
    }

    navigateBack() {
        this.router.navigate(['app/residents']);
    }
}
