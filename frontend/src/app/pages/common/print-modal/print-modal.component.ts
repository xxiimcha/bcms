import { Component, ElementRef, Input, ViewChild, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BarangayResident } from '../../../model/BarangayResident.model';
import { BarangayResidentDocument } from '../../../model/BarangayResidentDocument.model';

@Component({
	selector: 'app-print-modal',
	templateUrl: './print-modal.component.html',
	styleUrls: ['./print-modal.component.scss']
})
export class PrintModalComponent {

	@Input() residentDetail: BarangayResident | undefined;
	@Input() residentRequest: BarangayResidentDocument | undefined;
	@Input() certificateContent: string = '';
	@ViewChild('modalBody') modalBody: ElementRef | any;
	certificateHTML: SafeHtml = '';

	constructor(
		public activeModal: NgbActiveModal,
		private sanitizer: DomSanitizer
	) { }

	ngAfterViewInit() {
        setTimeout(() => {
            this.generateCertificateHTML();
        });
    }

    generateCertificateHTML() {
		const dateIssuedString = this.residentRequest?.date_issued;
		const purpose = this.residentRequest?.purpose;
	
		if (!dateIssuedString) {
			return;
		}
	
		const [month, day, year] = dateIssuedString.split('/').map(Number);
	
		// Create the date using year, month (0-based), and day
		const dateIssued = new Date(year, month - 1, day);
		
		const htmlContent = this.certificateContent
			.replace(/\[Name\]/g, `${this.residentDetail?.first_name} ${this.residentDetail?.last_name}`)
			.replace(/\[Age\]/g, `${this.residentDetail?.age}`)
			.replace(/\[Date\]/g, `${day}`) // Use 'day' directly
			.replace(/\[Month\]/g, `${dateIssued.toLocaleString('en', { month: 'long' })}`)
			.replace(/\[Year\]/g, `${year}`) // If you want to include the year
			.replace(/\[Purpose\]/g, `${purpose}`)
			.replace(/\[Barangay Captain\]/g, `Aquilino Dela Cruz, Sr`);
	
		this.certificateHTML = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
	}
	
	
	printAction() {
		// Construct the HTML content to be copied
		const htmlContent = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Print</title>
				<!-- Include any necessary stylesheets, scripts, etc. -->
			</head>
			<body>
				${this.modalBody.nativeElement.outerHTML} <!-- Include the content of the modal -->
			</body>
			</html>
		`;
	
		// Resolve relative URLs to absolute URLs
		const resolvedHtmlContent = this.resolveRelativeUrls(htmlContent);
	
		// Convert the HTML content to a Blob
		const blob = new Blob([resolvedHtmlContent], { type: 'text/html' });
	
		// Create a URL for the Blob
		const url = URL.createObjectURL(blob);
	
		// Open a new window with the URL
		const newWindow: Window | any = window.open(url, '_blank');
	
		newWindow.print();
	
		URL.revokeObjectURL(url);
	}
	
	resolveRelativeUrls(htmlContent: string): string {
		const baseUrl = window.location.origin + '/';
	
		const resolvedHtmlContent = htmlContent.replace(/(src|href)="([^"]+)"/gi, (match, p1, p2) => {
			if (p2.startsWith('http://') || p2.startsWith('https://')) {
				return `${p1}="${p2}"`;
			}
			const adjustedUrl = p2.startsWith('/app') ? p2.slice(4) : p2;
			const absoluteUrl = new URL(adjustedUrl, baseUrl).href;
			return `${p1}="${absoluteUrl}"`;
		});
	
		return resolvedHtmlContent;
	}	
	
    cancelAction() {
        this.activeModal.dismiss();
    }
}
