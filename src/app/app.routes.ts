import { Routes } from '@angular/router';
import { ViewPageComponent } from './pages/view-page/view-page.component';
export const routes: Routes = [
    {
        path: 'view',
        component: ViewPageComponent
    },
    {
        path: '',
        redirectTo: '/',
        pathMatch: 'full'
    }
];
