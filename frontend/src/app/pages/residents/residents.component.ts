import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BarangayResident } from '../../model/BarangayResident.model';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'residents-cmp',
    moduleId: module.id,
    templateUrl: 'residents.component.html',
    styleUrls: ['./residents.component.scss']
})

export class TableComponent implements OnInit {

    barangayResidents: BarangayResident[] = [];
    filteredResidents: BarangayResident[] = []; // For filtered residents
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isConfirmationVisible: boolean = false;
    searchQuery: string = ''; // Search query string

    constructor(
        private apiService: ApiService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadResidents();
    }

    loadResidents() {
        this.apiService.getResidents().subscribe(residents => {
            this.barangayResidents = residents;
            this.filteredResidents = [...residents]; // Initialize filteredResidents with all residents initially
            this.filterResidents(); // Apply initial filtering if needed
        });
    }

    filterResidentByPurok(event: any) {
        let purokQuery = event.target.value;
        if (purokQuery.trim() !== '') {
            this.filteredResidents = this.barangayResidents.filter(resident => 
                resident.purok === purokQuery
            );
            this.filteredResidents.sort().reverse();
        } else {
            this.filteredResidents = [...this.barangayResidents.sort().reverse()]; // Reset filteredResidents if searchQuery is empty
        }
    }

    // Function to filter residents based on searchQuery
    filterResidents() {
        if (this.searchQuery.trim() !== '') {
            this.filteredResidents = this.barangayResidents.filter(resident =>
                resident.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                resident.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                resident.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
            this.filteredResidents.sort().reverse();
        } else {
            this.filteredResidents = [...this.barangayResidents.sort().reverse()]; // Reset filteredResidents if searchQuery is empty
        }
    }

    editPersonalDetails(resident: BarangayResident) {
        if (this.router) {
            this.router.navigate(['app/residents/profile', resident.id]);
        }
    }

    viewPersonalDetails(resident: BarangayResident) {
        if (this.router) {
            this.router.navigate(['app/residents/profile/view', resident.id]);
        }
    }

    deletePersonalDetails(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteResident(id).subscribe(res => {
                    if(res) {
                        this.toastr.success('Resident Record deleted successfully', 'Close');
                        this.loadResidents();
                    }
                });
            }
        });
    }

    get paginatedResidents() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredResidents.slice(startIndex, startIndex + this.itemsPerPage); // Use filteredResidents instead of barangayResidents
    }

    totalPages() {
        const totalResidents = this.filteredResidents.length; // Use filteredResidents instead of barangayResidents
        return Math.ceil(totalResidents / this.itemsPerPage);
    }

    visiblePages() {
        const total = this.totalPages();
        const current = +this.currentPage;
        const delta = 2;
        let start = Math.max(1, current - delta);
        let end = Math.min(total, current + delta);
        
        if (end - start < 2 * delta) {
            start = Math.max(1, end - 2 * delta);
        }
        
        return Array.from({length: (end - start) + 1}, (_, i) => start + i);
    }
    
    // Function to handle search
    search() {
        this.filterResidents(); // Apply filtering
        this.currentPage = 1; // Reset currentPage when searching
    }
    
    goToPage(page: number) {
        this.currentPage = page;
    }
}
