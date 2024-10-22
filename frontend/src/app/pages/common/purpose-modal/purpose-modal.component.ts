import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-purpose-modal',
	templateUrl: './purpose-modal.component.html',
	styleUrls: ['./purpose-modal.component.scss']
})
export class PurposeModalComponent {

	@Output() confirmed: EventEmitter<{ confirmed: boolean, purpose: string }> = new EventEmitter<{ confirmed: boolean, purpose: string }>();
	purpose: string = '';

	constructor(
		public activeModal: NgbActiveModal
	) { }

    confirmAction() {
        this.confirmed.emit({ confirmed: true, purpose: this.purpose });
        this.activeModal.close();
    }

    cancelAction() {
        this.activeModal.dismiss();
    }
}
