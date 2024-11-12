import { Component, ViewChild, OnInit } from '@angular/core';
import {
    ApexChart,
    ChartComponent,
    ApexAxisChartSeries,
    ApexXAxis,
    ApexYAxis,
    ApexTooltip,
    ApexStroke
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

export interface PopulationForecastChart {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
}

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);

    public classificationOverviewChart!: Partial<any> | any;
    public ageOverviewChart!: Partial<any> | any;
    public populationForecastChart!: Partial<PopulationForecastChart> | any;

    censusProfiles: CensusProfile[] = [];
    totalPopulation: number = 0;
    seniorCitizenPercentage: number = 0;
    maleCount: number = 0;
    femaleCount: number = 0;
    malePercentage: string = '';
    femalePercentage: string = '';
    forecastYears: string[] = [];

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
        this.getPopulationForecast();
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

    getPopulationForecast() {
        this.dashboardService.getPopulationForecast().subscribe(data => {
            this.initializePopulationForecastChart(data);
        }, error => {
            console.error('Error fetching population forecast:', error);
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

    initializePopulationForecastChart(data: any) {
        // Ensure `current` and `forecast` data exists to avoid null errors
        const currentData = data.current || { population: 0, employed: 0, unemployed: 0 };
        const forecastData = data.forecast || { population: 0, employed: 0, unemployed: 0 };

        // Extract year from `created_at` if available, else use default years
        const currentYear = new Date(currentData.created_at || Date.now()).getFullYear();
        const nextYear = currentYear + 1;

        this.forecastYears = [currentYear.toString(), nextYear.toString()];

        this.populationForecastChart = {
            series: [
                {
                    name: 'Population',
                    data: [currentData.population, forecastData.population]
                },
                {
                    name: 'Employed',
                    data: [currentData.employed, forecastData.employed]
                },
                {
                    name: 'Unemployed',
                    data: [currentData.unemployed, forecastData.unemployed]
                }
            ],
            chart: {
                type: 'line',
                height: 350
            },
            xaxis: {
                categories: this.forecastYears
            },
            yaxis: {
                title: {
                    text: 'Counts'
                }
            },
            stroke: {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            }
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
