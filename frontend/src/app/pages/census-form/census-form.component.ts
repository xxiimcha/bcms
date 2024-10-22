import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CensusProfile } from '../../model/CensusProfile.model';

@Component({
    selector: 'census-form-cmp',
    moduleId: module.id,
    templateUrl: 'census-form.component.html',
    styleUrls: ['./census-form.component.scss']
})
export class CensusFormComponent implements OnInit {

    censusId: number = 0;
    profileForm: FormGroup;
    deletedEmployerIds: number[] = [];
    deletedFamilyIds: number[] = [];
    userRole: string | null = localStorage.getItem('userRole');

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.route.params.subscribe(params => {
            this.censusId = params['id'] ?? 0;
        });

        this.profileForm = this.formBuilder.group({
            id: [null],
            first_name: ['', [Validators.required]],
            middle_name: '',
            last_name: ['', [Validators.required]],
            address: '',
            ownership: '',
            provincial_address: '',
            length_of_stay: '',
            gender: '',
            civil_status: '',
            birthdate: '',
            place_of_birth: '',
            contact_number: '',
            height: '',
            weight: '',
            religion: '',
            email: ['', [Validators.required, Validators.email]],
            voter: '',
            four_ps: '',
            pwd: '',
            elementary: '',
            elementary_address: '',
            high_school: '',
            high_school_address: '',
            vocational: '',
            vocational_address: '',
            college: '',
            college_address: '',
            employerRows: this.formBuilder.array([]),
            familyRows: this.formBuilder.array([]) // Added family rows
        });

        if(this.userRole !== 'admin') {
            this.disableAllExceptCertificate();
        }
    }

    ngOnInit() {
        if (this.censusId > 0) {
            this.apiService.getResidentById(this.censusId).subscribe(cen => {
                this.profileForm.patchValue(cen);
                this.setEmployerRows(cen.employerRows);
                this.setFamilyRows(cen.familyRows);
            });
        } else {
            this.addEmployerRow();
            this.addFamilyRow(); // Initialize with one family row
        }
    }

    disableAllExceptCertificate() {
        Object.keys(this.profileForm.controls).forEach(key => {
            const control = this.profileForm.get(key);
            if (control) {
                if (key !== 'employerRows' && key !== 'familyRows') {
                    control.disable(); // Disable other controls
                } else if (key === 'familyRows' || key === 'employerRows') {
                    const familyRowsArray = control as FormArray;
                    // console.log('Family Rows:', familyRowsArray.controls['0']); // Log the array of controls
    
                    // familyRowsArray.controls.forEach((group, index) => {
                    //     console.log(`Disabling controls in family row ${index}`);
                    //     if (group instanceof FormGroup) {
                    //         // Disable each control in the FormGroup
                    //         Object.keys(group.controls).forEach(innerKey => {
                    //             group.get(innerKey)?.disable();
                    //             console.log(`Disabled control: ${innerKey} in row ${index}`);
                    //         });
                    //     }
                    // });
                }
            }
        });
    }
    
    setEmployerRows(employers: any[]) {
        const employerRows = this.employerRows;
        employerRows.clear(); // Clear existing rows
        if(employers.length > 0) {
            employers.forEach(employer => {
                employerRows.push(this.formBuilder.group({
                    id: [employer.id || null], // Populate with existing ID
                    duration: [employer.duration || ''],
                    employer_name: [employer.employer_name || ''],
                    employer_address: [employer.employer_address || ''],
                    monthly_salary: [employer.monthly_salary || '']
                }));
            });
        } else {
            const employerGroup = this.formBuilder.group({
                id: [null],
                duration: ['', Validators.required],
                employer_name: ['', Validators.required],
                employer_address: ['', Validators.required],
                monthly_salary: ['', Validators.required]
            });
            employerRows.push(employerGroup);
        }
    }

    setFamilyRows(familyMembers: any[]) {
        const familyRows = this.familyRows;
        familyRows.clear();
        if(familyMembers.length > 0) {
            familyMembers.forEach(member => {
                familyRows.push(this.formBuilder.group({
                    id: [member.id || null], // Populate with existing ID
                    full_name: [member.full_name || '', Validators.required],
                    position: [member.position || ''],
                    age: [member.age || '', [Validators.min(0)]],
                    birthdate: [member.birthdate || ''],
                    civil_status: [member.civil_status || ''],
                    occupation: [member.occupation || '']
                }));
            });
        } else {
            const familyGroup = this.formBuilder.group({
                id: [null],
                full_name: ['', Validators.required],
                position: [''],
                age: ['', [Validators.min(0)]],
                birthdate: [''],
                civil_status: [''],
                occupation: ['']
            });
            familyRows.push(familyGroup);
        }
    }

    get employerRows(): FormArray {
        return this.profileForm.get('employerRows') as FormArray;
    }

    addEmployerRow() {
        const employerGroup = this.formBuilder.group({
            id: [null], // Add an ID field for tracking
            duration: ['', Validators.required],
            employer_name: ['', Validators.required],
            employer_address: ['', Validators.required],
            monthly_salary: ['', Validators.required]
        });
        this.employerRows.push(employerGroup);
    }

    removeEmployerRow(index: number) {
        const employerRow = this.employerRows.at(index);
        const employerId = employerRow.get('id')?.value; // Get ID if exists
        if (employerId) {
            this.deletedEmployerIds.push(employerId); // Track ID for deletion
        }
        this.employerRows.removeAt(index);
    }

    get familyRows(): FormArray {
        return this.profileForm.get('familyRows') as FormArray;
    }

    addFamilyRow() {
        const familyGroup = this.formBuilder.group({
            id: [null], // Add an ID field for tracking
            full_name: ['', Validators.required],
            position: [''],
            age: ['', [Validators.min(0)]],
            birthdate: [''],
            civil_status: [''], // Ensure the name matches your template
            occupation: ['']
        });
        this.familyRows.push(familyGroup);
    }

    removeFamilyRow(index: number) {
        const familyRow = this.familyRows.at(index);
        const familyId = familyRow.get('id')?.value; // Get ID if exists
        if (familyId) {
            this.deletedFamilyIds.push(familyId); // Track ID for deletion
        }
        this.familyRows.removeAt(index);
    }

    saveCensus() {
        const payload = {
            ...this.profileForm.value,
            deletedEmployerIds: this.deletedEmployerIds, // Include deleted employer IDs
            deletedFamilyIds: this.deletedFamilyIds // Include deleted family IDs
        };

        const saveObservable = this.censusId === 0 
            ? this.apiService.saveResident(payload) 
            : this.apiService.updateResident(payload);

        saveObservable.subscribe(() => {
            this.router.navigate(['app/census']);
        }, error => {
            console.error('Error saving profile:', error);
        });
    }
}
