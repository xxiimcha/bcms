import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:8000/api'; // Update this to your API's base URL

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Method to fetch census profiles with token authorization
  getCensusProfiles(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/census-profiles`, { headers });
  }

  // Method to fetch classification data with token authorization
  getClassificationData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/classification-data`, { headers });
  }

  // Method to fetch household members data with token authorization
  getHouseholdMembers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/household-members`, { headers });
  }

  // Method to fetch the total population
  getTotalPopulation(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/total-population`, { headers });
  }

  // Method to fetch age distribution data for the age chart
  getAgeDistribution(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/age-distribution`, { headers });
  }
  
  getPopulationForecast(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/population-forecast`, { headers });
  }
}
