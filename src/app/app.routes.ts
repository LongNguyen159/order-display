import { Routes } from '@angular/router';
import { ViewPageComponent } from './pages/view-page/view-page.component';
import { ControllerPageComponent } from './pages/controller-page/controller-page.component';

export const routes: Routes = [
    {
        path: 'view',
        component: ViewPageComponent
    },
    {
        path: 'controller',
        component: ControllerPageComponent
    },
];
