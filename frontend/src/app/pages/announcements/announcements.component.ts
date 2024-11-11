import { Component, OnInit } from '@angular/core';
import { AnnouncementService, Announcement } from '../../services/announcement.service';

@Component({
    selector: 'app-announcements',
    templateUrl: './announcements.component.html',
    styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
    announcements: Announcement[] = [];
    newAnnouncement = {
      title: '',
      content: '',  // Match this with the database column name
      target_user_type: 'all'  // Match this with the database column name
    };

    constructor(private announcementService: AnnouncementService) {}

    ngOnInit(): void {
        this.fetchAnnouncements();
    }

    fetchAnnouncements(): void {
        this.announcementService.getAnnouncements().subscribe(data => {
            this.announcements = data;
        });
    }

    createAnnouncement(): void {
        if (this.newAnnouncement.title && this.newAnnouncement.content && this.newAnnouncement.target_user_type) {
            this.announcementService.createAnnouncement(this.newAnnouncement).subscribe(() => {
                this.fetchAnnouncements();
                this.newAnnouncement = { title: '', content: '', target_user_type: 'all' };
            });
        }
    }

    deleteAnnouncement(id: number): void {
        this.announcementService.deleteAnnouncement(id).subscribe(() => {
            this.fetchAnnouncements();
        });
    }
}
