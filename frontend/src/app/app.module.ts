import { NgModule } from '@angular/core';
import { ToastrModule } from "ngx-toastr";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SidebarModule } from './sidebar/sidebar.module';
import { NavbarModule } from './shared/navbar/navbar.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from "./pages/authentication/login/login.component";
import { RegisterComponent } from "./pages/authentication/register/register.component";
import { ForgotPasswordComponent } from "./pages/authentication/forgot-password/forgot-password.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
	declarations: [
		AppComponent,
		AdminLayoutComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		QrCodeModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		SidebarModule,
		NavbarModule,
		MatSnackBarModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		ToastrModule.forRoot(),
		MatProgressSpinnerModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
