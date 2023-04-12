import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';


@NgModule({
    declarations: [
        DashboardComponent,
        ActionDialogComponent
    ],
    imports: [
        SharedModule,
        DashboardRoutingModule
    ],
    exports: [
        
    ]
})
export class DashboardModule { }
