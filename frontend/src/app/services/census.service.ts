import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CensusProfile } from '../model/CensusProfile.model';

@Injectable({
    providedIn: 'root'
})
export class CensusService {
    private apiUrl = 'http://localhost:8000/api'; // Update with your API URL if needed
    private authToken: string | null = localStorage.getItem('authToken');

    constructor(private http: HttpClient) {}

    // Method to set Authorization headers
    private getHeaders(): HttpHeaders {
        return this.authToken
            ? new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)
            : new HttpHeaders();
    }

    // Method to save a census profile with Authorization header
    saveCensusProfile(data: any): Observable<any> {
        const headers = this.getHeaders();
        return this.http.post(`${this.apiUrl}/census-profiles`, data, { headers }).pipe(
            catchError(error => {
                console.error('Error saving census profile:', error);
                return of({ success: false, message: 'Failed to save census profile' });
            })
        );
    }

    // Method to retrieve all census profiles with Authorization header
    getCensusData(): Observable<CensusProfile[]> {
        const headers = this.getHeaders();
        return this.http.get<any>(`${this.apiUrl}/census-profiles`, { headers }).pipe(
            map(response => Array.isArray(response) ? response : []), // Ensure response is an array
            catchError(error => {
                console.error('Error fetching census data:', error);
                return of([]); // Return an empty array if there's an error
            })
        );
    }    

    // Method to delete a census profile by ID with Authorization header
    deleteCensusProfile(id: number): Observable<any> {
        const headers = this.getHeaders();
        return this.http.delete(`${this.apiUrl}/census-profiles/${id}`, { headers }).pipe(
            catchError(error => {
                console.error('Error deleting census profile:', error);
                return of({ success: false, message: 'Failed to delete census profile' });
            })
        );
    }

    getCensusProfileById(id: number): Observable<CensusProfile> {
        const headers = this.getHeaders();
        return this.http.get<CensusProfile>(`${this.apiUrl}/census-profiles/${id}`, { headers });
    }    

    // Method to set the auth token dynamically, e.g., after login
    setAuthToken(token: string) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }
}
