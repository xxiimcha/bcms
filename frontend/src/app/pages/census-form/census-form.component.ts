import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CensusService } from '../../services/census.service';

@Component({
    selector: 'census-form-cmp',
    templateUrl: './census-form.component.html',
    styleUrls: ['./census-form.component.scss']
})
export class CensusFormComponent implements OnInit {
    profileForm: FormGroup;
    profileId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private censusService: CensusService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.profileForm = this.formBuilder.group({
            date_of_reinterview: [''],
            respondent_name: ['', Validators.required],
            respondent_address: ['', Validators.required],
            total_members: ['', Validators.required],
            male_members: ['', Validators.required],
            female_members: ['', Validators.required],
            householdMembers: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.profileId = params['id'] ? +params['id'] : null;
            if (this.profileId) {
                this.loadProfileData(this.profileId);
            } else {
                this.addHouseholdMember(); // Initialize at least one member for new form
            }
        });
    }

    get householdMembers(): FormArray {
        return this.profileForm.get('householdMembers') as FormArray;
    }

    addHouseholdMember() {
        const memberGroup = this.formBuilder.group({
            name: ['', Validators.required],
            relationship: ['', Validators.required],
            sex: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            age: [null, [Validators.required, Validators.min(0)]],
            isPWD: [false],
            is4PsBeneficiary: [false],
            isEmployed: [false],
            educationalAttainment: ['']
        });
        this.householdMembers.push(memberGroup);
    }

    removeHouseholdMember(index: number) {
        this.householdMembers.removeAt(index);
    }

    loadProfileData(id: number) {
        this.censusService.getCensusProfileById(id).subscribe(
            profile => {
                console.log('Fetched profile:', profile); // Debugging log
                this.profileForm.patchValue({
                    date_of_reinterview: profile.date_of_reinterview,
                    respondent_name: profile.respondent_name,
                    respondent_address: profile.respondent_address,
                    total_members: profile.total_members,
                    male_members: profile.male_members,
                    female_members: profile.female_members
                });
                this.setHouseholdMembers(profile.householdMembers || []);
            },
            error => {
                console.error('Error loading profile data:', error);
                alert('Failed to load profile data');
            }
        );
    }

    setHouseholdMembers(members: any[]) {
        const householdMembersArray = this.householdMembers;
        householdMembersArray.clear(); // Clear existing members if any
        members.forEach(member => {
            householdMembersArray.push(this.formBuilder.group({
                name: [member.name, Validators.required],
                relationship: [member.relationship, Validators.required],
                sex: [member.sex, Validators.required],
                dateOfBirth: [member.date_of_birth, Validators.required],
                age: [member.age, [Validators.required, Validators.min(0)]],
                isPWD: [member.is_pwd],
                is4PsBeneficiary: [member.is_4ps_beneficiary],
                isEmployed: [member.is_employed],
                educationalAttainment: [member.educational_attainment]
            }));
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.censusService.saveCensusProfile(this.profileForm.value).subscribe(
                response => {
                    console.log(response.message);
                    alert('Census profile saved successfully');
                    this.router.navigate(['/app/census']);
                },
                error => {
                    console.error('Error saving profile:', error);
                    alert('Failed to save the census profile');
                }
            );
        } else {
            alert('Please fill all required fields');
        }
    }
}
