import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BarangayResident } from '../../model/BarangayResident.model';

@Component({
    selector: 'census-cmp',
    moduleId: module.id,
    templateUrl: 'census.component.html',
    styleUrls: ['./census.component.scss']
})

export class CensusComponent implements OnInit {

    census: BarangayResident[] = [];
    filteredCensus: BarangayResident[] = []; // For filtered residents
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isConfirmationVisible: boolean = false;
    searchQuery: string = ''; // Search query string
    userRole: string | null = localStorage.getItem('userRole');

    constructor(
        private apiService: ApiService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadCensus();
    }

    loadCensus() {
        this.apiService.getResidents().subscribe(c => {
            this.census = c;
            this.filteredCensus = [...c];
            this.filterCensus();
        });
    }

    // Function to filter residents based on searchQuery
    filterCensus() {
        if (this.searchQuery.trim() !== '') {
            this.filteredCensus = this.census.filter(res =>
                res.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                res.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                res.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
            this.filteredCensus.sort().reverse();
        } else {
            this.filteredCensus = [...this.census.sort().reverse()]; // Reset filteredResidents if searchQuery is empty
        }
    }

    editCensus(census: BarangayResident) {
        if (this.router) {
            this.router.navigate(['app/census/form', census.id]);
        }
    }

    view(census: BarangayResident) {
        if (this.router) {
            this.router.navigate(['app/census/form', census.id]);
        }
    }

    delete(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteResident(id).subscribe(res => {
                    if(res) {
                        this.toastr.success('Census Record deleted successfully', 'Close');
                        this.loadCensus();
                    }
                });
            }
        });
    }

    get paginatedCensus() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredCensus.slice(startIndex, startIndex + this.itemsPerPage); // Use filteredResidents instead of barangayResidents
    }

    totalPages() {
        const totalResidents = this.filterCensus.length; // Use filteredResidents instead of barangayResidents
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
        this.filterCensus(); // Apply filtering
        this.currentPage = 1; // Reset currentPage when searching
    }
    
    goToPage(page: number) {
        this.currentPage = page;
    }

    addCensusProfile() {
        console.log("test")
        this.router.navigate(['app/census/form']);
    }
}
