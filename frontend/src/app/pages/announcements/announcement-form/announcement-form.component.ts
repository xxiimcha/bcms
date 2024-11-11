import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../../services/announcement.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-announcement-form',
    templateUrl: './announcement-form.component.html',
    styleUrls: ['./announcement-form.component.scss']
})
export class AnnouncementFormComponent implements OnInit {
    announcementForm: FormGroup;
    announcementId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private announcementService: AnnouncementService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.announcementForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            target_user_type: ['all', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.announcementId = params['id'] ? +params['id'] : null;
            if (this.announcementId) {
                this.loadAnnouncement(this.announcementId);
            }
        });
    }

    loadAnnouncement(id: number): void {
        this.announcementService.getAnnouncement(id).subscribe(announcement => {
            this.announcementForm.patchValue(announcement);
        });
    }

    onSubmit(): void {
        if (this.announcementForm.valid) {
            const announcement: Announcement = this.announcementForm.value;
            if (this.announcementId) {
                this.announcementService.updateAnnouncement(this.announcementId, announcement).subscribe(() => {
                    alert('Announcement updated successfully');
                    this.router.navigate(['/announcements']);
                });
            } else {
                this.announcementService.createAnnouncement(announcement).subscribe(() => {
                    alert('Announcement created successfully');
                    this.router.navigate(['/announcements']);
                });
            }
        }
    }
}
