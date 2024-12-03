import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    totalCertificates: number = 0;
    certificateTypeCount: number = 0;
    monthlyIssuance: number = 0;
    pendingNotifications: number = 0;
    notifications: any[] = []; // Store notifications data
    certificateTypeChart: any;
    purposeChart: any;
    certificatesIssuedChart: any;
    forecastingChart: any; // For forecasted data
    isLoading: boolean = true;
    hasError: boolean = false;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading = true;

        // Fetch total certificates
        this.dashboardService.getTotalCertificates().subscribe(
            (data) => {
                this.totalCertificates = data.total;
            },
            (error) => this.handleError(error)
        );

        // Fetch certificate types
        this.dashboardService.getCertificateTypeData().subscribe(
            (data) => {
                this.certificateTypeCount = data.length;
                this.initializeCertificateTypeChart(data);
            },
            (error) => this.handleError(error)
        );

        // Fetch purposes
        this.dashboardService.getPurposeData().subscribe(
            (data) => {
                this.initializePurposeChart(data);
            },
            (error) => this.handleError(error)
        );

        // Fetch issuance timeline
        this.dashboardService.getIssuanceTimelineData().subscribe(
            (data) => {
                this.initializeIssuanceTimelineChart(data);
            },
            (error) => this.handleError(error)
        );

        // Fetch forecasting data
        this.dashboardService.getForecastingData().subscribe(
            (data) => {
                this.initializeForecastingChart(data);
            },
            (error) => this.handleError(error)
        );

        // Fetch notifications
        this.dashboardService.getNotifications().subscribe(
            (data) => {
                this.notifications = data;
                this.pendingNotifications = this.notifications.filter((n) => n.status === 'Unread').length;
            },
            (error) => this.handleError(error)
        );

        this.isLoading = false;
    }

    initializeCertificateTypeChart(data: any[]) {
        const series = data.map((item) => item.count);
        const labels = data.map((item) => item.certificate_type);

        this.certificateTypeChart = {
            series: series,
            chart: { type: 'pie', height: 300 },
            labels: labels,
        };
    }

    initializePurposeChart(data: any[]) {
        const series = data.map((item) => item.count);
        const categories = data.map((item) => item.purpose);

        this.purposeChart = {
            series: [{ data: series }],
            chart: { type: 'bar', height: 300 },
            xaxis: { categories: categories },
            plotOptions: { bar: { horizontal: true } },
        };
    }

    initializeIssuanceTimelineChart(data: any[]) {
        const series = data.map((item) => item.count);
        const categories = data.map((item) => item.date);

        this.certificatesIssuedChart = {
            series: [{ name: 'Certificates Issued', data: series }],
            chart: { type: 'line', height: 300 },
            xaxis: {
                categories: categories,
                labels: { style: { fontSize: '12px', fontWeight: 600 } }
            },
            stroke: { curve: 'smooth', width: 2 },
            tooltip: { theme: 'light' }
        };
    }

    initializeForecastingChart(data: any[]) {
        const series = data.map((item) => item.predicted_value);
        const categories = data.map((item) => item.month);

        this.forecastingChart = {
            series: [{ name: 'Forecasted Certificates', data: series }],
            chart: { type: 'line', height: 300 },
            xaxis: { categories: categories },
            stroke: { curve: 'smooth', width: 2 },
            tooltip: { theme: 'light' }
        };
    }

    handleError(error: any) {
        console.error('Error loading dashboard data:', error);
        this.hasError = true;
        this.isLoading = false;
    }
}
