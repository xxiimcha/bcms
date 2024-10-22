import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BarangayStaff } from '../../model/BarangayStaff.model';

@Component({
    selector: 'barangay-officials-cmp',
    moduleId: module.id,
    templateUrl: 'barangay-officials.component.html',
    styleUrls: ['./barangay-officials.component.scss']
})

export class BarangayOfficialsComponent implements OnInit {

    barangayStaff: BarangayStaff[] = [];
    filteredStaffs: BarangayStaff[] = []; // For filtered residents
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
        this.loadBaranggayStaff();
    }

    loadBaranggayStaff() {
        this.apiService.getBarangayStaffs().subscribe(staff => {
            this.barangayStaff = staff;
            this.filteredStaffs = [...staff];
            this.filterStaffs();
        });
    }

    // Function to filter residents based on searchQuery
    filterStaffs() {
        if (this.searchQuery.trim() !== '') {
            this.filteredStaffs = this.barangayStaff.filter(res =>
                res.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                res.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                res.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
            this.filteredStaffs.sort().reverse();
        } else {
            this.filteredStaffs = [...this.barangayStaff.sort().reverse()]; // Reset filteredResidents if searchQuery is empty
        }
    }

    editPersonalDetails(staff: BarangayStaff) {
        if (this.router) {
            this.router.navigate(['app/residents/profile', staff.id]);
        }
    }

    view(staff: BarangayStaff) {
        if (this.router) {
            this.router.navigate(['app/brgy-official/form', staff.id]);
        }
    }

    delete(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.apiService.deleteStaff(id).subscribe(res => {
                    if(res) {
                        this.toastr.success('Barangay Official Record deleted successfully', 'Close');
                        this.loadBaranggayStaff();
                    }
                });
            }
        });
    }

    get paginatedResidents() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredStaffs.slice(startIndex, startIndex + this.itemsPerPage); // Use filteredResidents instead of barangayResidents
    }

    totalPages() {
        const totalResidents = this.filteredStaffs.length; // Use filteredResidents instead of barangayResidents
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
        this.filterStaffs(); // Apply filtering
        this.currentPage = 1; // Reset currentPage when searching
    }
    
    goToPage(page: number) {
        this.currentPage = page;
    }

    addBarangayOfficial() {
        console.log("test")
        this.router.navigate(['app/brgy-official/form']);
    }
}