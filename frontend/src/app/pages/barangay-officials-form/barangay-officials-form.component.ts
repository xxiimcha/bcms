import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BarangayStaff } from '../../model/BarangayStaff.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'barangay-officials-form-cmp',
    moduleId: module.id,
    templateUrl: 'barangay-officials-form.component.html',
    styleUrls: ['./barangay-officials-form.component.scss']
})

export class BarangayOfficialsFormComponent implements OnInit {

    barangayStaff: BarangayStaff[] = [];
    filteredStaffs: BarangayStaff[] = []; // For filtered residents
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isConfirmationVisible: boolean = false;
    searchQuery: string = ''; // Search query string
    staffId: number = 0;

    profileForm: FormGroup;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.route.params.subscribe(params => {
            this.staffId = params['id'];
        });
        this.profileForm = this.formBuilder.group({
            id: null,
            email: ['', [Validators.required, Validators.email]],
            middle_name: '',
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            role: ['', [Validators.required]],
            password: ''
        });
    }

    ngOnInit() {
        if(this.staffId > 0) {
            this.apiService.getBarangayStaff(this.staffId).subscribe(staff => {
                this.profileForm.patchValue({
                    id: staff.id,
                    email: staff.email,
                    middle_name: staff.middle_name,
                    first_name: staff.first_name,
                    last_name: staff.last_name,
                    role: staff.role,
                    password: staff.password
                })
            })
        }
    }

    saveOfficial() {
        if(this.staffId == 0 || this.staffId == null) {
            this.apiService.saveStaff(this.profileForm).subscribe(() => {
                this.router.navigate(['app/brgy-official']);
            }, error => {
                console.error('Error updating profile:', error);
            });
        } else {
            this.apiService.updateStaff(this.profileForm.value).subscribe(() => {
                this.router.navigate(['app/brgy-official']);
            }, error => {
                console.error('Error updating profile:', error);
            });
        }
    }
}
