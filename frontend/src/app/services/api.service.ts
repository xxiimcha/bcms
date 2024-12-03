import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, of, tap } from 'rxjs';
import { BarangayResident } from '../model/BarangayResident.model';
import { BarangayDocument } from '../model/BarangayDocument.model';
import { BarangayResidentDocument } from '../model/BarangayResidentDocument.model';
import { BarangayStaff } from '../model/BarangayStaff.model';
import { CensusProfile } from '../model/CensusProfile.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = 'http://localhost:8000/api';
    authToken: any = null;

    constructor(private http: HttpClient) {
        this.authToken = localStorage.getItem('authToken');
    }

    getResidents(): Observable<BarangayResident[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/residents`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching residents:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveResident(resident: FormGroup): Observable<BarangayResident> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/resident`, resident, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateResident(resident: any): Observable<BarangayResident> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
    
        // Use PUT for updates
        return this.http.put<any>(`${this.apiUrl}/update-resident`, resident, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error updating resident:', error);
                throw error;
            })
        );
    }    

    deleteResident(id: number): Observable<BarangayResident> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/resident/${id}`, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    getResidentById(id: any): Observable<BarangayResident> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/resident/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    //DOCUMENT

    getDocuments(): Observable<BarangayDocument[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/documents`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching documents:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveDocument(document: BarangayDocument): Observable<BarangayDocument> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/document`, document, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving documents:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateDocument(document: BarangayDocument): Observable<BarangayDocument> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/document`, document, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    deleteDocument(id: number): Observable<BarangayDocument> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/document/${id}`, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving document:', error);
                throw error;
            })
        );
    }

    getDocumentById(id: any): Observable<BarangayDocument> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/document/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching document:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    //DOCUMENT BY RESIDENT

    getResidentsDocuments(): Observable<BarangayResidentDocument[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/resident-documents`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching documents-residents:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveResidentsDocument(resident_document: BarangayResidentDocument): Observable<BarangayResidentDocument> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/resident-document`, resident_document, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving documents:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateResidentDocument(document: BarangayResidentDocument): Observable<BarangayResidentDocument> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.put<BarangayResidentDocument>(
            `${this.apiUrl}/update-request/${document.id}`,
            document,
            { headers }
        ).pipe(
            tap((response) => {
                console.log('Document updated successfully:', response);
                return response;
            }),
            catchError((error) => {
                console.error('Error updating document:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getResidentsDocumentById(id: any): Observable<BarangayResidentDocument> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/resident-document/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    getResidentsDocumentHistory(id: any): Observable<BarangayResidentDocument[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/resident-document-history/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    staffChangePassword(values: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/staff/change-password`, values, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving documents:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    residentChangePassword(values: any): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/resident/change-password`, values, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving documents:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getBarangayStaffs(): Observable<BarangayStaff[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/staffs`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    getBarangayStaff(id: number): Observable<BarangayStaff> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/staff/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    deleteStaff(id: number): Observable<BarangayStaff> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/staff/${id}`, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    saveStaff(staff: FormGroup): Observable<BarangayStaff> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/staff`, staff.value, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateStaff(staff: FormGroup): Observable<BarangayStaff> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/staff`, staff, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    getCensuses(): Observable<CensusProfile[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/censuses`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    getCensus(id: number): Observable<CensusProfile> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/census/${id}`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    deleteCensus(id: number): Observable<CensusProfile> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/census/${id}`, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    saveCensus(staff: FormGroup): Observable<CensusProfile> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/census`, staff, { headers }).pipe(
            tap ((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateCensus(staff: FormGroup): Observable<CensusProfile> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/census`, staff, { headers }).pipe(
            tap((response) => {
                return response;
            }),
            catchError(error => {
                console.error('Error saving resident:', error);
                throw error;
            })
        );
    }

    getAllClassificationCounts(): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/resident-census/classifications`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }

    getForecast(): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any>(`${this.apiUrl}/residents/forecast`, { headers }).pipe(
                tap((response) => {
                    return response;
                }),
                catchError(error => {
                    console.error('Error fetching documents-resident:', error);
                    return of();
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of();
        }
    }
}