import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Announcement {
  id: number;
  title: string;
  content: string;  // Ensure this matches the field name in your database and backend
  target_user_type: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    private apiUrl = 'http://localhost:8000/api/announcements';
    private authToken: string | null = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        return this.authToken 
            ? new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)
            : new HttpHeaders();
    }

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    createAnnouncement(data: Partial<Announcement>): Observable<Announcement> {
        return this.http.post<Announcement>(this.apiUrl, data, { headers: this.getHeaders() });
    }

    deleteAnnouncement(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    // Optional: method to set the auth token dynamically, if needed
    setAuthToken(token: string) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }
}
