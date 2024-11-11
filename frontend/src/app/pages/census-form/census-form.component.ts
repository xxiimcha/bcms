import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CensusService } from '../../services/census.service';

@Component({
    selector: 'census-form-cmp',
    templateUrl: './census-form.component.html',
    styleUrls: ['./census-form.component.scss']
})
export class CensusFormComponent implements OnInit {
    profileForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private censusService: CensusService) {
        this.profileForm = this.formBuilder.group({
            date_of_reinterview: '2024-01-01',
            respondent_name: ['John Doe', Validators.required],
            respondent_address: ['123 Main St', Validators.required],
            total_members: ['5', Validators.required],
            male_members: ['2', Validators.required],
            female_members: ['3', Validators.required],
            householdMembers: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.addHouseholdMember();
        this.addHouseholdMember();
    }

    get householdMembers(): FormArray {
        return this.profileForm.get('householdMembers') as FormArray;
    }

    addHouseholdMember() {
        const memberGroup = this.formBuilder.group({
            name: ['Jane Doe', Validators.required],
            relationship: ['Daughter', Validators.required],
            sex: ['Female', Validators.required],
            dateOfBirth: ['01/2000', Validators.required],
            age: [24, [Validators.required, Validators.min(0)]],
            isPWD: [false],
            is4PsBeneficiary: [true],
            isEmployed: [true],
            educationalAttainment: ['Bachelor\'s Degree']
        });
        this.householdMembers.push(memberGroup);
    }

    removeHouseholdMember(index: number) {
        this.householdMembers.removeAt(index);
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.censusService.saveCensusProfile(this.profileForm.value).subscribe(
                response => {
                    console.log(response.message);
                    alert('Census profile saved successfully');
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
