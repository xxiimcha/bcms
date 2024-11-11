import { Component, OnInit } from '@angular/core';
import { CensusService } from '../../services/census.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CensusProfile } from '../../model/CensusProfile.model';
import { ConfirmationDialogComponent } from '../common/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'census-cmp',
    moduleId: module.id,
    templateUrl: 'census.component.html',
    styleUrls: ['./census.component.scss']
})
export class CensusComponent implements OnInit {

    census: CensusProfile[] = [];
    filteredCensus: CensusProfile[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    searchQuery: string = '';
    userRole: string | null = localStorage.getItem('userRole');

    constructor(
        private censusService: CensusService,
        private router: Router,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadCensus();
    }

    loadCensus() {
        this.censusService.getCensusData().subscribe(data => {
            console.log('Received census data:', data); // Log to check structure
            this.census = Array.isArray(data) ? data : [];
            this.filteredCensus = [...this.census];
            this.filterCensus();
        });
    }

    filterCensus() {
        if (this.searchQuery.trim() !== '') {
            this.filteredCensus = this.census.filter(profile =>
                profile.respondent_name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredCensus = [...this.census];
        }
    }

    editCensus(census: CensusProfile) {
        this.router.navigate(['app/census/form', census.id]);
    }

    view(census: CensusProfile) {
        this.router.navigate(['app/census/form', census.id]);
    }

    delete(id: number) {
        const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: 'md', backdrop: 'static', centered: true });
        modalRef.componentInstance.confirmed.subscribe((result: boolean) => {
            if (result) {
                this.censusService.deleteCensusProfile(id).subscribe(res => {
                    this.toastr.success('Census Record deleted successfully', 'Close');
                    this.loadCensus();
                });
            }
        });
    }

    get paginatedCensus() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredCensus.slice(startIndex, startIndex + this.itemsPerPage);
    }

    totalPages() {
        return Math.ceil(this.filteredCensus.length / this.itemsPerPage);
    }

    visiblePages() {
        const total = this.totalPages();
        const delta = 2;
        let start = Math.max(1, this.currentPage - delta);
        let end = Math.min(total, this.currentPage + delta);
        
        if (end - start < 2 * delta) {
            start = Math.max(1, end - 2 * delta);
        }
        
        return Array.from({ length: (end - start) + 1 }, (_, i) => start + i);
    }

    search() {
        this.filterCensus();
        this.currentPage = 1;
    }

    goToPage(page: number) {
        this.currentPage = page;
    }

    addCensusProfile() {
        this.router.navigate(['app/census/form']);
    }
}
