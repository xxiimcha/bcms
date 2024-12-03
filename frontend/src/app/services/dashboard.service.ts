import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = 'http://localhost:8000/api';

    constructor(private http: HttpClient) {}

    // Function to get the authorization headers
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
        if (!token) {
            console.error('Authorization token not found in localStorage');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // Error handling function
    private handleError(error: any): Observable<never> {
        console.error('API error occurred:', error);
        return throwError(error);
    }

    // Get data for certificate types
    getCertificateTypeData(): Observable<any[]> {
        return this.http
            .get<any[]>(`${this.apiUrl}/certificate-types`, {
                headers: this.getHeaders()
            })
            .pipe(catchError(this.handleError));
    }

    getNotifications(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/notifications`, {
          headers: this.getHeaders()
      });
  }
    // Get data for purposes
    getPurposeData(): Observable<any[]> {
        return this.http
            .get<any[]>(`${this.apiUrl}/purposes`, {
                headers: this.getHeaders()
            })
            .pipe(catchError(this.handleError));
    }

    // Get data for issuance timeline
    getIssuanceTimelineData(): Observable<any[]> {
        return this.http
            .get<any[]>(`${this.apiUrl}/issuance-timeline`, {
                headers: this.getHeaders()
            })
            .pipe(catchError(this.handleError));
    }

    // Get total certificates issued
    getTotalCertificates(): Observable<{ total: number }> {
        return this.http
            .get<{ total: number }>(`${this.apiUrl}/total-certificates`, {
                headers: this.getHeaders()
            })
            .pipe(catchError(this.handleError));
    }

    // Get forecasting data (if applicable)
    getForecastingData(): Observable<any[]> {
        return this.http
            .get<any[]>(`${this.apiUrl}/forecasting`, {
                headers: this.getHeaders()
            })
            .pipe(catchError(this.handleError));
    }
}
