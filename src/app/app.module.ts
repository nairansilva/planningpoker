import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule, PoNotificationModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { VotingComponent } from './pages/voting/voting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AdminPlanningComponent } from './pages/adminPlanning/adminPlanning.component';
import { AngularFireModule } from '@angular/fire/compat';
import { VoteThreadComponent } from './pages/voting/voteThread/voteThread.component';
import { environment } from '../environments/environment';
import { TotalVotingComponent } from './pages/voting/totalVoting/totalVoting.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VotingComponent,
    AdminPlanningComponent,
    VoteThreadComponent,
    TotalVotingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    PoTemplatesModule,
    PoNotificationModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    // provideFirestore(() => getFirestore()),
    // provideStorage(() => getStorage()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
