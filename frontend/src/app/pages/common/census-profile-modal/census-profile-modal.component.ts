import { Component, ElementRef, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-census-profile-modal',
	templateUrl: './census-profile-modal.component.html',
	styleUrls: ['./census-profile-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CensusProfileModalComponent {
	@Input() profileData: any[] = [];
	@ViewChild('modalBody') modalBody: ElementRef | any;
	isLoading: boolean = true; // Initialize loading state

	constructor(
		private dialogRef: MatDialogRef<CensusProfileModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		console.log(this.data);
		if (this.data) {
			this.isLoading = false;
		}
	}

	cancelAction() {
		this.dialogRef.close();
	}
}
