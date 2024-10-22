import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'settings-cmp',
    moduleId: module.id,
    templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit{

    inputPassword1: string = ""
    inputPassword2: string = "";
    userId: any = null;
    userRole: any = null;


    userSettings: any;

    userSettingsUpdateSuccess: boolean = false;

    constructor(
        private apiService: ApiService,
    ) { 
        this.userRole = localStorage.getItem('userRole');
        this.userId = localStorage.getItem('userId');
    }

    ngOnInit(){
        if(this.userRole !== 'resident') {
            this.apiService.getBarangayStaff(this.userId).subscribe(res => {
                if(res) {
                    this.userSettings = res;
                }
            });
        } else {
            this.apiService.getResidentById(this.userId).subscribe(res => {
                if(res) {
                    this.userSettings = res;
                }
            });
        }
    }

    saveOfficial() {
        this.apiService.updateStaff(this.userSettings).subscribe((res) => {
            if(res) {
                this.userSettingsUpdateSuccess = true;
                // setTimeout(() => {
                //     if (res?.role === 'admin') {
                //         this.router.navigate(['app/dashboard']);
                //     }
                // }, 2000);
            }
        }, error => {
            console.error('Error updating profile:', error);
        });
    }
}
