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
            first_name: ['', [Validators.required]],
            middle_name: '',
            last_name: ['', [Validators.required]],
            date: ['', Validators.required],
            present_address: ['', Validators.required],
            sex: ['', Validators.required],
            age: '',
            civil_status: '',
            birthdate: '',
            previous_address: '',
            house_owner: '',
            months_years: '',
            residency_type: '',
            contact_number: '',
            purpose: ['', Validators.required],
            other_purpose: '',
            certificate: ['', Validators.required],
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
            if (response) {
                this.documents = response;
            }
        });
    
        // Listen for changes in the birthdate field and calculate age
        this.profileForm.get('birthdate')?.valueChanges.subscribe(value => {
            if (value) {
                const age = this.calculateAge(value);
                this.profileForm.get('age')?.setValue(age, { emitEvent: false }); // Update age without emitting valueChanges event
            }
        });
    }
    
    // Function to calculate age based on birthdate
    private calculateAge(birthdate: string): number {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    }    

    ngOnChanges(changes: SimpleChanges) {
        if (changes['profileData'] && !changes['profileData'].firstChange) {
            this.initializeForm();
            this.initializeNewResidentCertificate();
        }
    }

    onCertificateChange(event: any) {
        const selectedId = event.target.value;
        const selectedDocument = this.documents.find((doc) => doc.id == selectedId);
        this.selectedDocumentType = selectedDocument?.certificate_type ?? '';
        this.selectedDocumentValue = selectedDocument?.certificate_value ?? '';
    }
    
    private initializeNewResidentCertificate() {
        this.apiService.getResidentsDocumentById(this.residentId).subscribe(response => {
            this.residentDocument = response;
        });
    }

    private initializeForm() {
        this.profileForm.patchValue({
            id: this.profileData?.id,
            first_name: this.profileData?.first_name,
            middle_name: this.profileData?.middle_name,
            last_name: this.profileData?.last_name,
            date: this.profileData?.date,
            present_address: this.profileData?.present_address,
            sex: this.profileData?.sex,
            age: this.profileData?.age,
            birthdate: this.profileData?.birthdate,
            civil_status: this.profileData?.civil_status,
            previous_address: this.profileData?.previous_address,
            house_owner: this.profileData?.house_owner,
            months_years: this.profileData?.months_years,
            residency_type: this.profileData?.residency_type,
            contact_number: this.profileData?.contact_number,
            purpose: this.profileData?.purpose,
            other_purpose: this.profileData?.other_purpose,
            certificate: this.profileData?.certificate
        });
    }

    disableAllExceptCertificate() {
        Object.keys(this.profileForm.controls).forEach(key => {
            if (key !== 'certificate' && key !== 'purpose' && key !== 'other_purpose') {
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
        console.log('Form Values:', this.profileForm.value); // Log all form values
        console.log('Selected Document:', this.selectedDocumentType);
        console.log('Selected Purpose:', this.profileForm.value.purpose);
    
        if (this.selectedDocumentType && this.profileForm.value.purpose) {
            const requestResidentData: BarangayResidentDocument = {
                resident_id: this.profileData.id,
                certificate_type: this.selectedDocumentType,
                certificate_file: this.selectedDocumentValue,
                id: 0,
                date_issued: new Date().toLocaleDateString(),
                purpose: this.profileForm.value.purpose,
                status: this.userRole === 'admin' ? 'Completed' : 'Requested',
            };
    
            this.apiService.saveResidentsDocument(requestResidentData).subscribe(
                (res) => {
                    this.toastr.success('Resident Document Requested Successfully', 'Close');
                    this.initializeNewResidentCertificate();
                },
                (error) => {
                    console.error('Error updating profile:', error);
                    this.toastr.error('Error while requesting document', 'Close');
                }
            );
        } else {
            this.toastr.error('Please select certificate and purpose', 'Close');
        }
    }    

    generateQRCode() {
        this.modalService.open(QRModalComponent, { size: 'lg', backdrop: 'static', centered: true });
    }

    navigateBack() {
        this.router.navigate(['app/residents']);
    }
}
