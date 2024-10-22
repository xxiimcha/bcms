import { Component, OnInit } from '@angular/core';
import { BarangayResident } from '../../model/BarangayResident.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'profile-cmp',
    moduleId: module.id,
    templateUrl: 'profile.component.html'
})

export class ProfileComponent implements OnInit{

    residentId: string = "";
    mode: string = "";
    barangayResident!: BarangayResident;
    userId: string = "";

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService
    ) { 
        this.userId = localStorage.getItem('userId') || "";
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            this.residentId = params['id'] || this.userId;
            this.apiService.getResidentById(this.residentId).subscribe(resident => {
                this.barangayResident = resident;
            });
        });
    }
}
