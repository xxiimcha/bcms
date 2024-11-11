import { Component, OnInit } from '@angular/core';
import { AnnouncementService, Announcement } from '../../../services/announcement.service';

@Component({
    selector: 'app-announcement-list',
    templateUrl: './announcement-list.component.html',
    styleUrls: ['./announcement-list.component.scss']
})
export class AnnouncementListComponent implements OnInit {
    announcements: Announcement[] = [];
    currentUserRole: 'admin' | 'user' = 'user'; // Example of current user role

    constructor(private announcementService: AnnouncementService) {}

    ngOnInit(): void {
        this.loadAnnouncements();
    }

    loadAnnouncements(): void {
        this.announcementService.getAnnouncements().subscribe(data => {
            this.announcements = data.filter(announcement =>
                announcement.target_user_type === 'all' || 
                announcement.target_user_type === this.currentUserRole
            );
        });
    }
}
