import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-qr-modal',
	templateUrl: './qr-modal.component.html',
	styleUrls: ['./qr-modal.component.scss']
})
export class QRModalComponent {

	@ViewChild('qrCodeCanvas') qrCodeCanvas!: ElementRef;
	url = window.location.href;
	currentURL: string = '';

	constructor(
		public activeModal: NgbActiveModal
	) { 
		this.generateSpecialURL();
	}

	generateSpecialURL() {
		const currentURL = encodeURIComponent(window.location.href);
		this.currentURL = `http://192.168.1.37:8000/api/open-in-desktop?url=${currentURL}`;
	}
	

    cancelAction() {
        this.activeModal.dismiss();
    }

	downloadQRCode() {
		const canvas = this.qrCodeCanvas.nativeElement.querySelector('canvas');
		console.log(canvas)
		console.log(this.currentURL)
		const url = canvas.toDataURL('image/png');
		const a = document.createElement('a');
		a.href = url;
		a.download = 'qr-code.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}
