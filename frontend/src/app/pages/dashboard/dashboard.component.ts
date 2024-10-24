import { Component, ViewChild } from '@angular/core';
import {
	ApexChart,
	ChartComponent,
	ApexDataLabels,
	ApexLegend,
	ApexStroke,
	ApexTooltip,
	ApexAxisChartSeries,
	ApexXAxis,
	ApexYAxis,
	ApexGrid,
	ApexPlotOptions,
	ApexFill,
	ApexMarkers,
	ApexResponsive,
	ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { ApiService } from '../../services/api.service';
import { BarangayResident } from '../../model/BarangayResident.model';
import { BarangayResidentDocument } from '../../model/BarangayResidentDocument.model';
import { CensusProfileModalComponent } from '../common/census-profile-modal/census-profile-modal.component';
import { MatDialog } from '@angular/material/dialog';

export interface residentsOverviewChart {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions?: ApexPlotOptions;
	yaxis: ApexYAxis;
	xaxis: ApexXAxis;
	fill: ApexFill;
	tooltip: ApexTooltip;
	stroke: ApexStroke;
	legend: ApexLegend;
	grid: ApexGrid;
	marker: ApexMarkers;
}

export type ChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	responsive?: ApexResponsive[];
	labels: any[];
};

@Component({
	selector: 'dashboard-cmp',
	moduleId: module.id,
	templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {
	@ViewChild('chart') chart: ChartComponent = Object.create(null);

	public ageOverviewChart!: Partial<residentsOverviewChart> | any;
	public certificatesRequestedOverviewChart!: Partial<residentsOverviewChart> | any;
	public classificationOverviewChart!: Partial<residentsOverviewChart> | any;
	public chartOptions: Partial<ChartOptions> | any;
	public populationOverviewChart!: Partial<residentsOverviewChart> | any;

	residents: BarangayResident[] = [];
	residentsDocuments: BarangayResidentDocument[] = [];

	checkedListString: String[] = [];
	residentsByMonth: Map<string, BarangayResident[]> = new Map();

	maleCount: number = 0;
	femaleCount: number = 0;
	malePercentage: string = '';
	femalePercentage: string = '';

	singleCount: number = 0;
	marriedCount: number = 0;
	separatedCount: number = 0;
	widowedCount: number = 0;
	singlePercentage: string = '';
	marriedPercentage: string = '';
	separatedPercentage: string = '';
	widowedPercentage: string = '';

	ageBrackets: string[] = ['Null', '0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];
	ageBracketCounts: number[] = new Array(this.ageBrackets.length).fill(0);
	seniorCitizenPercentage: number = 0;

	classificationBrackets: string[] = ['Children', 'Youth', 'Senior Citizens', 'PWD', '4Ps Members'];
	classificationBracketCount: number[] = new Array(this.classificationBrackets.length).fill(0);

	certificatesBracket: string[] = [];//: { type: string; count: number }[] = [];
	certificatesBracketCounts: number[] = new Array(this.certificatesBracket.length).fill(0);

	classificationData: any;

	constructor(
		private apiService: ApiService,
		private modalService: MatDialog
	) { }

	ngOnInit() {
		this.apiService.getResidents().subscribe(
			(response: BarangayResident[]) => {
				if (response && response.length > 0) {
					this.residents = response;
					this.calculateByGender();
					this.calculateByCivilStatus();
					this.initializeAgeChart();
				} else {
					console.error('Empty or undefined response received from API');
				}
			},
			(error) => {
				console.error('Error fetching residents:', error);
			}
		);

		this.apiService.getResidentsDocuments().subscribe(
			(response: BarangayResidentDocument[]) => {
				if (response && response.length > 0) {
					this.residentsDocuments = response;
					this.groupByCertificateType();
					this.initializeCertificateRequestsChart();
				} else {
					console.error('Empty or undefined response received from API');
				}
			},
			(error) => {
				console.error('Error fetching residents:', error);
			}
		);

		this.apiService.getAllClassificationCounts().subscribe(res => {
			if (res) {
				this.classificationData = res;
				this.classificationBracketCount = [
					res.children['ctr'],
					res.youth['ctr'],
					res.senior_citizen['ctr'],
					res.pwd['ctr'],
					res.four_ps['ctr']
				];
				this.initializeClassificationChart();
			}
		})

		this.apiService.getForecast().subscribe(res => {
			if(res) {
				this.initializePopulationChart(res);
			}
		});
	}

	groupByCertificateType() {
		this.residentsDocuments.forEach((item: BarangayResidentDocument) => {
			if (!this.certificatesBracket.includes(item.certificate_type)) {
				this.certificatesBracket.push(item.certificate_type);
			}
		});
		this.certificatesBracketCounts = new Array(this.certificatesBracket.length).fill(0);
	}

	calculateByGender() {
		this.residents.forEach(item => {
			if (item.gender == 'Male') {
				this.maleCount += 1;
			} else {
				this.femaleCount += 1;
			}
		});
		this.malePercentage = ((this.maleCount / this.residents.length) * 100).toFixed(2);
		this.femalePercentage = ((this.femaleCount / this.residents.length) * 100).toFixed(2);
	}

	calculateByCivilStatus() {
		this.residents.forEach(item => {
			if (item.civil_status == 'Single') {
				this.singleCount += 1;
			}
			if (item.civil_status == 'Married') {
				this.marriedCount += 1;
			}
			if (item.civil_status == 'Separated') {
				this.separatedCount += 1;
			}
			if (item.civil_status == 'Widowed') {
				this.widowedCount += 1;
			}
		});
		this.singlePercentage = ((this.singleCount / this.residents.length) * 100).toFixed(2);
		this.marriedPercentage = ((this.marriedCount / this.residents.length) * 100).toFixed(2);
		this.separatedPercentage = ((this.separatedCount / this.residents.length) * 100).toFixed(2);
		this.widowedPercentage = ((this.widowedCount / this.residents.length) * 100).toFixed(2);
	}

	initializeClassificationChart() {
		this.classificationOverviewChart = {
			series: this.classificationBracketCount,
			chart: {
				width: 400,
				type: 'pie',
				events: {
					dataPointSelection: (event: any, chartContext: any, config: { dataPointIndex: string | number; w: { config: { labels: string[] } } }) => {
						const ix = config.dataPointIndex;
						this.handleDataPointSelection(ix); // Call the method here
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
	}

	handleDataPointSelection(index: any) {
		switch (index) {
			case 0:
				this.viewCensusProfile(this.classificationData['children']['profile']);
				break;
			case 1:
				this.viewCensusProfile(this.classificationData['youth']['profile']);
				break;
			case 2:
				this.viewCensusProfile(this.classificationData['senior_citizen']['profile']);
				break;
			case 3:
				this.viewCensusProfile(this.classificationData['pwd']['profile']);
				break;
			case 4:
				this.viewCensusProfile(this.classificationData['four_ps']['profile']);
				break;
			default:
				console.log("No Data Available");
				break;
		}
	}

	viewCensusProfile(data: any) {
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


	initializeAgeChart() {
		let series: any[] = [];
		this.calculateAgeBracketCounts();
		this.calculateSeniorCitizenPercentage();
		series = [
			{
				name: 'Age',
				data: this.ageBracketCounts,
				color: '#49BEFF',
			},
		]

		this.ageOverviewChart = {
			series: series,

			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				strokeDashArray: 3,
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			plotOptions: {
				bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
			},
			chart: {
				type: 'bar',
				height: 390,
				offsetX: -15,
				toolbar: { show: false },
				foreColor: '#adb0bb',
				fontFamily: 'inherit',
				sparkline: { enabled: false },
			},
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: {
				type: 'category',
				categories: this.ageBrackets,
				labels: {
					style: { cssClass: 'grey--text lighten-2--text fill-color' },
				},
			},
			yaxis: {
				show: true,
				min: 0,
				max: 100,
				tickAmount: 4,
				labels: {
					style: {
						cssClass: 'grey--text lighten-2--text fill-color',
					},
				},
			},
			stroke: {
				show: true,
				width: 3,
				lineCap: 'butt',
				colors: ['transparent'],
			},
			tooltip: { theme: 'light' },

			responsive: [
				{
					breakpoint: 600,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 3,
							},
						},
					},
				},
			],
		};
	}

	initializePopulationChart(data: any) {
		let population: any[] = [];
		let employed: any[] = [];
		let unemployed: any[] = [];
		let monthNames: string[] = [];
		for (let i = 0; i < data.population.length; i++) {
			population.push(data.population[i].count);
			monthNames.push(data.population[i].year);
		}

		this.populationOverviewChart = {
			series: [
				{
					name: 'Population',
					data: population,
					color: '#49BEFF',
				}
			],
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: monthNames,
			}
		};
	}

	initializeCertificateRequestsChart() {
		let series: any[] = [];
		this.calculateCertificateCounts();
		series = [
			{
				name: 'Certificate Type',
				data: this.certificatesBracketCounts,
				color: '#49BEFF',
			},
		]

		this.certificatesRequestedOverviewChart = {
			series: series,

			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				strokeDashArray: 3,
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			plotOptions: {
				bar: { horizontal: true, columnWidth: '35%', borderRadius: [4] },
			},
			chart: {
				type: 'bar',
				height: 215,
				offsetX: -15,
				toolbar: { show: false },
				foreColor: '#adb0bb',
				fontFamily: 'inherit',
				sparkline: { enabled: false },
			},
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: {
				type: 'category',
				categories: this.certificatesBracket,
				labels: {
					style: { cssClass: 'grey--text lighten-2--text fill-color' },
				},
			},
			yaxis: {
				show: true,
				min: 0,
				max: 100,
				tickAmount: 4,
				labels: {
					style: {
						cssClass: 'grey--text lighten-2--text fill-color',
					},
				},
			},
			stroke: {
				show: true,
				width: 3,
				lineCap: 'butt',
				colors: ['transparent'],
			},
			tooltip: { theme: 'light' },

			responsive: [
				{
					breakpoint: 600,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 3,
							},
						},
					},
				},
			],
		};
	}

	calculateAgeBracketCounts(): void {
		this.residents.forEach(person => {
			if (person.birthdate) {
				const age = this.calculateAge(new Date(person.birthdate).toDateString());
				const ageBracketIndex = this.getAgeBracketIndex(age);
				if (ageBracketIndex !== -1) {
					this.ageBracketCounts[ageBracketIndex]++;
				}
			}
		});
	}

	calculateSeniorCitizenPercentage(): void {
		const totalPersons = this.residents.length;
		let seniorCitizenCount = 0;

		this.residents.forEach(person => {
			if (person.birthdate) {
				const age = this.calculateAge(new Date(person.birthdate).toDateString());
				if (age >= 60) {
					seniorCitizenCount++;
				}
			}
		});

		this.seniorCitizenPercentage = (seniorCitizenCount / totalPersons) * 100;
		this.seniorCitizenPercentage = parseFloat(this.seniorCitizenPercentage.toFixed(2));
	}

	calculateAge(birthdate: string): number {
		const today = new Date();
		const birthDate = new Date(birthdate);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		return age;
	}

	getAgeBracketIndex(age: number): number {
		if (age < 0) {
			return 0; // 'Null' bracket
		} else if (age < 5) {
			return 1; // '0-4' bracket
		} else if (age < 10) {
			return 2; // '5-9' bracket
		} else if (age < 15) {
			return 3; // '10-14' bracket
		} else if (age < 20) {
			return 4; // '15-19' bracket
		} else if (age < 25) {
			return 5; // '20-24' bracket
		} else if (age < 30) {
			return 6; // '25-29' bracket
		} else if (age < 35) {
			return 7; // '30-34' bracket
		} else if (age < 40) {
			return 8; // '35-39' bracket
		} else if (age < 45) {
			return 9; // '40-44' bracket
		} else if (age < 50) {
			return 10; // '45-49' bracket
		} else if (age < 55) {
			return 11; // '50-54' bracket
		} else if (age < 60) {
			return 12; // '55-59' bracket
		} else {
			return 13; // '60+' bracket
		}
	}

	calculateCertificateCounts(): void {
		this.residentsDocuments.forEach(cert => {
			const type = cert.certificate_type;
			const index = this.certificatesBracket.indexOf(type);
			if (index !== -1) {
				this.certificatesBracketCounts[index]++;
			}
		});
	}
}
