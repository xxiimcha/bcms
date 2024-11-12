import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiUrl = 'http://localhost:8000/api';
    private authTokenKey = 'authToken';
    private userRoleKey = 'userRole';
    private userFullNameKey = 'userFullName';
    private userIdKey = 'userId';

    constructor(private http: HttpClient) { }

    login(credentials: FormGroup): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials.value).pipe(
            tap((response) => {
                if (response.token) {
                    localStorage.setItem(this.authTokenKey, response.token);
                    if (response.role && response.name) {
                        localStorage.setItem(this.userRoleKey, response.role);
                        localStorage.setItem(this.userFullNameKey, response.name);
                        localStorage.setItem(this.userIdKey, response.id);
                        return response;
                    }
                }
            })
        );
    }

    logout(): Observable<any> {
        const authToken = localStorage.getItem(this.authTokenKey);
        if (!authToken) {
            return of(null);
        }

        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + authToken);
        return this.http.post<any>(`${this.apiUrl}/logout`, null, { headers }).pipe(
            tap(() => {
                localStorage.removeItem(this.authTokenKey);
                localStorage.removeItem(this.userRoleKey); 
                localStorage.removeItem(this.userFullNameKey); 
                localStorage.removeItem(this.userIdKey); 
            }),
            catchError((error) => {
                // Handle logout error
                console.error('Logout failed:', error);
                return of(null);
            })
        );
    }

    isLoggedIn(): Observable<boolean> {
        const authToken = localStorage.getItem(this.authTokenKey);
        return authToken ? of(true) : of(false);
    }

    getUserRole(): Observable<string | null> {
        return of(localStorage.getItem(this.userRoleKey));
    }

    register(registerForm: FormGroup): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register`, registerForm.value).pipe(
            tap((response) => {
            })
        );
    }

    forgotPassword(forgotPasswordForm: FormGroup): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/forgot-password`, forgotPasswordForm.value).pipe(
            tap((response) => {
            })
        );
    }
}