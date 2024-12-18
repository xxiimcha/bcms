import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
	moduleId: module.id,
	selector: 'navbar-cmp',
	templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
	private listTitles: any[] = [];
	location: Location;
	private nativeElement: Node;
	private toggleButton: any;
	private sidebarVisible: boolean;

	public isCollapsed = true;
	@ViewChild("navbar-cmp", { static: false }) button: any;
	userFullName: string | null = localStorage.getItem('userFullName');
	userRole: string | null = localStorage.getItem('userRole');

	constructor(
		location: Location, 
		private element: ElementRef, 
		private router: Router,
		private authService: AuthService
	) {
		this.location = location;
		this.nativeElement = element.nativeElement;
		this.sidebarVisible = false;
	}

	ngOnInit() {
		this.listTitles = ROUTES.filter(listTitle => listTitle);
		var navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
	}
	getTitle() {
		var titlee = this.location.prepareExternalUrl(this.location.path());
		if (titlee.charAt(0) === '#') {
			titlee = titlee.slice(1);
		}
		for (var item = 0; item < this.listTitles.length; item++) {
			if (this.listTitles[item].path === titlee) {
				return this.listTitles[item].title;
			}
		}
		return 'Dashboard';
	}

	getUserName() {
		return this.userFullName ? this.userFullName.toString().charAt(0).toUpperCase() + this.userFullName.toString().slice(1) : "";
	}

	getUserRole() {
		return this.userRole ? this.userRole.toString().charAt(0).toUpperCase() + this.userRole.toString().slice(1) : "";
	}

	logout() {
        this.authService.logout().subscribe(
            () => {
				this.router.navigate(['login']);
            }
        );
    }
}
