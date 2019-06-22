import { NgModule } from "@angular/core";
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
@NgModule({
    declarations: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        PagesComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component
    ]
})

export class PagesModule { }