import { Component, ViewChild, OnInit } from '@angular/core';
import {
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexAxisChartSeries,
    ApexXAxis,
    ApexYAxis,
    ApexGrid,
    ApexStroke,
    ApexTooltip,
} from 'ng-apexcharts';
import { DashboardService } from '../../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { CensusProfileModalComponent } from '../common/census-profile-modal/census-profile-modal.component';

export interface CensusProfile {
    id: number;
    date_of_reinterview?: Date | string;
    respondent_name: string;
    respondent_address: string;
    total_members: number;
    male_members: number;
    female_members: number;
    householdMembers?: HouseholdMember[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HouseholdMember {
    id?: number;
    name: string;
    relationship: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
    age: number;
    isPWD: boolean;
    is4PsBeneficiary: boolean;
    isEmployed: boolean;
    educationalAttainment: string;
}

export interface ClassificationChart {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
}

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);

    public classificationOverviewChart!: Partial<ClassificationChart> | any;
    public ageOverviewChart!: Partial<any> | any;

    censusProfiles: CensusProfile[] = [];
    maleCount: number = 0;
    femaleCount: number = 0;
    malePercentage: string = '';
    femalePercentage: string = '';
    totalPopulation: number = 0;
    seniorCitizenPercentage: number = 0;

    classificationBrackets: string[] = ['Children', 'Youth', 'Senior Citizens', 'PWD', '4Ps Members'];
    classificationBracketCount: number[] = new Array(this.classificationBrackets.length).fill(0);
    classificationData: any;
    
    ageBrackets: string[] = ['Null', '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];
    ageBracketCounts: number[] = [];

    constructor(
        private dashboardService: DashboardService,
        private modalService: MatDialog
    ) { }

    ngOnInit() {
        this.fetchTotalPopulation();
        this.fetchCensusProfiles();
        this.fetchClassificationData();
        this.getAgeDistributionData();
    }

    fetchTotalPopulation() {
        this.dashboardService.getTotalPopulation().subscribe(
            response => {
                this.totalPopulation = response.total_population;
            },
            error => {
                console.error('Error fetching total population:', error);
            }
        );
    }

    fetchCensusProfiles() {
        this.dashboardService.getCensusProfiles().subscribe(
            (response: CensusProfile[]) => {
                if (response && response.length > 0) {
                    this.censusProfiles = response;
                    this.calculateByGender();
                    this.initializeClassificationChart();
                } else {
                    console.error('Empty or undefined response received from API');
                }
            },
            (error) => {
                console.error('Error fetching census profiles:', error);
            }
        );
    }

    fetchClassificationData() {
        this.dashboardService.getClassificationData().subscribe(res => {
            if (res) {
                this.classificationData = res;
                this.classificationBracketCount = [
                    res.children || 0,
                    res.youth || 0,
                    res.senior_citizens || 0,
                    res.pwd || 0,
                    res.four_ps || 0
                ];
                this.initializeClassificationChart();
            } else {
                console.error('Empty or undefined response received from API');
            }
        });
    }

    getAgeDistributionData() {
		this.dashboardService.getAgeDistribution().subscribe(data => {
			console.log('Age Distribution Data:', data); // Debugging line
			this.ageBracketCounts = data?.ageBracketCounts || new Array(this.ageBrackets.length).fill(0);
			this.seniorCitizenPercentage = data?.seniorCitizenPercentage || 0;
			this.initializeAgeChart();
		}, error => {
			console.error('Error fetching age distribution data:', error);
			this.ageBracketCounts = new Array(this.ageBrackets.length).fill(0);
			this.seniorCitizenPercentage = 0;
			this.initializeAgeChart();
		});
	}
	

    calculateByGender() {
        this.maleCount = this.censusProfiles.reduce((total, profile) => total + profile.male_members, 0);
        this.femaleCount = this.censusProfiles.reduce((total, profile) => total + profile.female_members, 0);

        const totalMembers = this.maleCount + this.femaleCount;
        this.malePercentage = ((this.maleCount / totalMembers) * 100).toFixed(2);
        this.femalePercentage = ((this.femaleCount / totalMembers) * 100).toFixed(2);
    }

    initializeClassificationChart() {
        if (this.classificationBracketCount.some(count => count > 0)) {
            this.classificationOverviewChart = {
                series: this.classificationBracketCount,
                chart: {
                    width: 400,
                    type: 'pie',
                    events: {
                        dataPointSelection: (event: any, chartContext: any, config: { dataPointIndex: number }) => {
                            this.handleDataPointSelection(config.dataPointIndex);
                        }
                    }
                },
                labels: this.classificationBrackets,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 500
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };
        } else {
            console.warn("No data available for the classification chart.");
        }
    }

    initializeAgeChart() {
        this.ageOverviewChart = {
            series: [
                {
                    name: 'Age Distribution',
                    data: this.ageBracketCounts,
                    color: '#49BEFF',
                }
            ],
            chart: {
                type: 'bar',
                height: 390,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
            },
            xaxis: {
                categories: this.ageBrackets,
            },
            yaxis: {
                max: 100, // Assuming percentages for a clearer view
                tickAmount: 4,
            },
            tooltip: {
                theme: 'light',
            },
        };
    }

    handleDataPointSelection(index: number) {
        const profileData = [
            this.classificationData['children']?.profiles || [],
            this.classificationData['youth']?.profiles || [],
            this.classificationData['senior_citizens']?.profiles || [],
            this.classificationData['pwd']?.profiles || [],
            this.classificationData['four_ps']?.profiles || []
        ][index];

        this.viewCensusProfile(profileData);
    }

    viewCensusProfile(data: HouseholdMember[]) {
        if (data && data.length > 0) {
            const modalRef = this.modalService.open(CensusProfileModalComponent, {
                width: '500px',
                data: data
            });
            modalRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed');
            });
        } else {
            alert('No profile data available to display.');
        }
    }
}
