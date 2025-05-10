import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { PanelComponent } from './pages/panel/panel.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'panel', component: PanelComponent },
      { path: 'patients', component: PatientsComponent },
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'chat', component: ChatComponent },
    ],
  },
];
