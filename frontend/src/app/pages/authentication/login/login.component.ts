import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    credentialsForm: FormGroup;
    loginError: boolean = false;
    loginSuccess: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) { 
        this.credentialsForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login() {
        this.authService.login(this.credentialsForm).subscribe(
            (response) => {
                console.log(response);
                if(!response?.error) {
                    this.loginSuccess = true;
                    setTimeout(() => {
                        if (response?.role === 'admin' || response?.role === 'Kagawad' || response?.role === 'Kapitan' || response?.role === 'Clearance Staff') {
                            this.router.navigate(['app/dashboard']);
                        } else {
                            this.router.navigate([`/app/residents/profile/view/${response?.id}`]);
                        }
                    }, 2000);
                } else {
                    this.loginError = true;
                }
            }
        );
    }
}
