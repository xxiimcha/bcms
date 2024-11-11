import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CensusService {
    private apiUrl = 'http://localhost:8000/api'; // Update with your API URL if needed
    private authToken: string | null = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    constructor(private http: HttpClient) {}

    // Method to set Authorization headers
    private getHeaders(): HttpHeaders {
        return this.authToken
            ? new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)
            : new HttpHeaders();
    }

    // Method to save census profile with Authorization header
    saveCensusProfile(data: any): Observable<any> {
        const headers = this.getHeaders();
        return this.http.post(`${this.apiUrl}/census-profiles`, data, { headers });
    }

    // Method to retrieve all census data with Authorization header
    getCensusData(): Observable<any[]> {
        const headers = this.getHeaders();
        return this.http.get<any[]>(`${this.apiUrl}/census-profiles`, { headers });
    }

    // Method to delete a census profile by ID with Authorization header
    deleteCensusProfile(id: number): Observable<any> {
        const headers = this.getHeaders();
        return this.http.delete(`${this.apiUrl}/census-profiles/${id}`, { headers });
    }

    // Method to set the auth token dynamically, e.g., after login
    setAuthToken(token: string) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }
}
