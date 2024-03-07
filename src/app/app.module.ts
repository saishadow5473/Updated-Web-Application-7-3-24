import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule  } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatTabsModule} from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HeadbarComponent } from './components/headbar/headbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { StatsCardTestComponent } from './components/stats-card-test/stats-card-test.component';
import { VitalGraphsComponent } from './components/vital-graphs/vital-graphs.component';
import { MeasurementHistoryComponent } from './components/measurement-history/measurement-history.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { ModalComponent } from './components/modal/modal.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';
import { SideNavigationBarComponent } from './components/side-navigation-bar/side-navigation-bar.component';
import { DtComponent } from './components/dt/dt.component';
import { AffiliatedUsersComponent } from './components/affiliated-users/affiliated-users.component';
import { TeleconsultdashboardComponent } from './components/teleconsultdashboard/teleconsultdashboard.component';
import { TeleconsultMyappointmentComponent } from './components/teleconsult-myappointment/teleconsult-myappointment.component';
import { MedicalComponent } from './components/medical/medical.component';
import { FitnessDashboardComponent } from './components/fitness-dashboard/fitness-dashboard.component';
import { TeleconsultMySubscriptionComponent } from './components/teleconsult-mysubscription/teleconsult-mysubscription.component';
import { TeleconsultSpecialityComponent } from './components/teleconsult-speciality/teleconsult-speciality.component';
import { SubscribeOnlineClassesComponent } from './components/subscribe-online-classes/subscribe-online-classes.component';
import { ChallengesComponent } from './components/challenges/challenges.component';
import { TeleconsultConsultationTypeComponent } from './components/teleconsult-consultation-type/teleconsult-consultation-type.component';
import { TeleconsultDoctorListComponent } from './components/teleconsult-doctor-list/teleconsult-doctor-list.component';
import { TeleconsultVideoCallComponent } from './components/teleconsult-video-call/teleconsult-video-call.component';
import { TeleconsultConfirmVisitComponent } from './components/teleconsult-confirm-visit/teleconsult-confirm-visit.component';
import { MedicalDocComponent } from './components/medical-doc-update/medical.component';
import { ConsultationDetailsViewComponent } from './components/consultation-details-view/consultation-details-view.component';
import { ChallengeCardComponent } from './components/challenge-card/challenge-card.component';
import { GenixTeleConsultationComponent } from './components/genix-tele-consultation/genix-tele-consultation.component';
import { HelpBotComponent } from './components/help-bot/help-bot.component';
import { JointAccountCreationComponent } from './components/joint-account-creation/joint-account-creation.component';
import { LeaderboardCardComponent } from './components/leaderboard-card/leaderboard-card.component';
import { LinkExistingAccountComponent } from './components/link-existing-account/link-existing-account.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { MetricesComponent } from './components/metrices/metrices.component';
import { PolicyComponent } from './components/policy/policy.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { SsoLoginComponent } from './components/sso-login/sso-login.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { TeleconsultFollowupComponent } from './components/teleconsult-followup/teleconsult-followup.component';
import { TeleconsultSummaryComponent } from './components/teleconsult-summary/teleconsult-summary.component';
import { UploadComponent } from './components/upload/upload.component';
import { TestComponent } from './components/test/test.component';
import { ApiHtmlPipe } from './services/api-html.pipe';

import { AppHttpInterceptorService } from './app-http-interceptor.service';
import { ConstantsService } from './services/constants.service';
import { EventEmitterService } from './services/event-emitter.service';
import { PasswordPatternDirective } from './directive/password-pattern.directive';
import { MatchPasswordDirective } from './directive/match-password.directive';
import { HeightValidatorDirective } from './directive/height-validator.directive';
import { DndDirective } from './dnd.directive';
import { JoyrideModule } from 'ngx-joyride';
import { DragScrollModule } from 'ngx-drag-scroll';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgOtpInputModule } from  'ng-otp-input';
import { AffiliatedCategoryUsersComponent } from './components/affiliated-category-users/affiliated-category-users.component';
import { MsalModule, MsalService, MSAL_INSTANCE  } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { socialLoginConfig } from './social-login-config';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: socialLoginConfig['microsoft']['clientId'],
      redirectUri: window.location.origin
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  })
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ForgetPasswordComponent,
    HeadbarComponent,
    SidebarComponent,
    FooterComponent,
    RecommendationsComponent,
    StatsCardTestComponent,
    VitalGraphsComponent,
    MeasurementHistoryComponent,
    RegisterAccountComponent,
    ModalComponent,
    TakeSurveyComponent,
    SideNavigationBarComponent,
    DtComponent,
    AffiliatedUsersComponent,
    TeleconsultdashboardComponent,
    TeleconsultMyappointmentComponent,
    MedicalComponent,
    FitnessDashboardComponent,
    TeleconsultMySubscriptionComponent,
    TeleconsultSpecialityComponent,
    SubscribeOnlineClassesComponent,
    ChallengesComponent,
    TeleconsultConsultationTypeComponent,
    TeleconsultDoctorListComponent,
    TeleconsultVideoCallComponent,
    TeleconsultConfirmVisitComponent,
    MedicalDocComponent,
    ConsultationDetailsViewComponent,
    ChallengeCardComponent,
    GenixTeleConsultationComponent,
    HelpBotComponent,
    JointAccountCreationComponent,
    LeaderboardCardComponent,
    LinkExistingAccountComponent,
    ManageAccountComponent,
    MetricesComponent,
    PolicyComponent,
    SearchComponent,
    SettingsComponent,
    SocialLoginComponent,
    SsoLoginComponent,
    StatsCardComponent,
    TeleconsultFollowupComponent,
    TeleconsultSummaryComponent,
    UploadComponent,
    TestComponent,
    ApiHtmlPipe,
    PasswordPatternDirective,
    MatchPasswordDirective,
    HeightValidatorDirective,
    DndDirective,
    AffiliatedCategoryUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatRippleModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatStepperModule,
    MatTableModule,
    MatDatepickerModule,  
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatMenuModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTabsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
    JoyrideModule.forRoot(),
    DragScrollModule,
    NgIdleKeepaliveModule.forRoot(),
    NgOtpInputModule,
    MsalModule,
    MatAutocompleteModule,
    SocialLoginModule
  ],
  providers: [
    ConstantsService,
    EventEmitterService,
    DatePipe,
    { provide: 'Window',  useValue: window },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptorService,
      multi:true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              socialLoginConfig['google']['clientId']
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})
export class AppModule { }
