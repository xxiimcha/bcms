import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Announcement {
    id?: number;
    title: string;
    content: string;
    target_user_type: 'all' | 'admin' | 'user';
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    private apiUrl = 'http://localhost:8000/api/announcements';

    constructor(private http: HttpClient) {}

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(this.apiUrl);
    }

    getAnnouncement(id: number): Observable<Announcement> {
        return this.http.get<Announcement>(`${this.apiUrl}/${id}`);
    }

    createAnnouncement(announcement: Announcement): Observable<Announcement> {
        return this.http.post<Announcement>(this.apiUrl, announcement);
    }

    updateAnnouncement(id: number, announcement: Announcement): Observable<Announcement> {
        return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement);
    }

    deleteAnnouncement(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
