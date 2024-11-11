import { Component, OnInit } from '@angular/core';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    role: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/app/dashboard', title: 'Dashboard', icon: 'nc-tv-2', class: '', role: 'super admin|admin|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/residents', title: 'Residents', icon: 'nc-single-02', class: '', role: 'super admin|admin|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/certificates', title: 'Certificates', icon: 'nc-paper', class: '', role: 'super admin|admin|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/census', title: 'Census Profile', icon: 'nc-badge', class: '', role: 'super admin|admin|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/announcements', title: 'Announcements', icon: 'nc-bell-55', class: '', role: 'super admin|admin|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/brgy-official', title: 'Brgy Officials', icon: 'nc-single-02', class: '', role: 'super admin' },
    { path: '/app/residents/profile/view/:id', title: 'Request Form', icon: 'nc-simple-add', class: '', role: 'resident' },
    { path: '/app/settings', title: 'Settings', icon: 'nc-bullet-list-67', class: '', role: 'super admin|admin|resident|Kapitan|Kagawad|Clearance Staff' },
    { path: '/app/profile', title: 'Profile', icon: 'nc-single-02', class: '', role: 'resident' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {

    userRole: string = "";
    userId: string = "";

    public menuItems: any[] = [];

    ngOnInit() {
        this.userRole = localStorage.getItem('userRole') || "";
        this.userId = localStorage.getItem('userId') || ""; // Assuming user ID is stored in local storage

        // Filter menu items based on the user's role and replace ':id' in the path with the actual user ID if needed
        this.menuItems = ROUTES
            .filter(r => this.hasAccess(r.role))
            .map(item => {
                if (item.path.includes(':id')) {
                    item.path = item.path.replace(':id', this.userId);
                }
                return item;
            });
    }

    /**
     * Checks if the user has access to the given roles
     * @param roles The roles allowed to access the route
     * @returns boolean - whether the user's role is included in the allowed roles
     */
    private hasAccess(roles: string): boolean {
        return roles.split('|').includes(this.userRole);
    }
}
