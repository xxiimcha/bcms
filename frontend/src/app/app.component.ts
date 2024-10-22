import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	userRole = localStorage.getItem('userRole');

	constructor() { }

	ngOnInit(): void {
		if(this.userRole === 'admin') {
			const socket = new WebSocket('ws://localhost:3000');
			socket.onopen = () => {
				console.log('Connected to WebSocket server');
			};

			socket.onmessage = (event) => {
				let obj = JSON.parse(event.data);
				console.log('Received message from server:', obj);
				if(obj?.event === "open-in-desktop") {
					window.open(obj?.message, '_blank');
				}
			};
		}
	}
}
