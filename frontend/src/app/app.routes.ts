import { Routes } from '@angular/router';
import { ViewPageComponent } from './pages/view-page/view-page.component';
import { ControllerPageComponent } from './pages/controller-page/controller-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
    {
        path: 'view',
        component: ViewPageComponent
    },
    {
        path: 'controller',
        component: ControllerPageComponent
    },
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
