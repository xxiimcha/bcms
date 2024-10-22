import { Component, OnInit } from '@angular/core';


@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

	userRole = localStorage.getItem('userRole');
	hasSideBar: boolean = false;

	ngOnInit() {
		if(this.userRole === 'admin' || this.userRole === 'Kagawad' || this.userRole === 'Kapitan') {
			this.hasSideBar = true;
		}
	}
}
