import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { BarangayResidentDocument } from '../../../model/BarangayResidentDocument.model';

@Component({
	selector: 'app-history-modal',
	templateUrl: './history-modal.component.html',
	styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent {

	@Input() residentId: number = 0;
	@ViewChild('modalBody') modalBody: ElementRef | any;
	residentDocumentsHistory: BarangayResidentDocument[] = [];

	constructor(
		public activeModal: NgbActiveModal,
		private apiService: ApiService
	) { }

	ngOnInit() {
        this.loadResidents();
    }

    loadResidents() {
        this.apiService.getResidentsDocumentHistory(this.residentId).subscribe(residents => {
			this.residentDocumentsHistory = residents;
        });
    }
	
    cancelAction() {
        this.activeModal.dismiss();
    }
}
