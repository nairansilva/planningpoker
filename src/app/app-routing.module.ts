import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VotingComponent } from './pages/voting/voting.component';
import { AdminPlanningComponent } from './pages/adminPlanning/adminPlanning.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'voting', component: VotingComponent },
  { path: 'admin', component: AdminPlanningComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
