import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { TakeSurveyComponent } from './components/take-survey/take-survey.component';
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
import { GenixTeleConsultationComponent } from './components/genix-tele-consultation/genix-tele-consultation.component';
import { HelpBotComponent } from './components/help-bot/help-bot.component';
import { JointAccountCreationComponent } from './components/joint-account-creation/joint-account-creation.component';
import { LinkExistingAccountComponent } from './components/link-existing-account/link-existing-account.component';
import { MetricesComponent } from './components/metrices/metrices.component';
import { PolicyComponent } from './components/policy/policy.component';
import { SearchComponent } from './components/search/search.component';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { SsoLoginComponent } from './components/sso-login/sso-login.component';
import { TeleconsultFollowupComponent } from './components/teleconsult-followup/teleconsult-followup.component';
import { TeleconsultSummaryComponent } from './components/teleconsult-summary/teleconsult-summary.component';
import { UploadComponent } from './components/upload/upload.component';
import { TestComponent } from './components/test/test.component';
import { AffiliatedCategoryUsersComponent } from './components/affiliated-category-users/affiliated-category-users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'register', component: RegisterAccountComponent },
  { path: 'takesurvey', component: TakeSurveyComponent },
  { path: 'export', component: DtComponent},
  { path: 'affiliated-users', component: AffiliatedUsersComponent },
  { path: 'teleconsultation', component: TeleconsultdashboardComponent },
  { path: 'myappointment', component: TeleconsultMyappointmentComponent },
  { path: 'medical', component: MedicalComponent },
  { path: 'fitnessPage', component: FitnessDashboardComponent },
  { path: 'mysubscription', component: TeleconsultMySubscriptionComponent },
  { path: 'teleconsult-speciality', component: TeleconsultSpecialityComponent },
  { path: 'subscribe-online-classes', component: SubscribeOnlineClassesComponent },
  { path: 'challenges', component: ChallengesComponent },
  { path: 'teleconsult-type', component: TeleconsultConsultationTypeComponent },
  { path: 'teleconsult-doctors', component: TeleconsultDoctorListComponent },
  { path: 'teleconsult-video-call', component: TeleconsultVideoCallComponent },
  { path: 'teleconsult-confirm-visit', component: TeleconsultConfirmVisitComponent },
  { path: 'medical-doc', component: MedicalDocComponent },
  { path: 'consultation-details-view', component: ConsultationDetailsViewComponent },
  { path: 'genixConsultation', component: GenixTeleConsultationComponent },
  { path: 'beepbop', component: HelpBotComponent },
  { path: 'export/:id',  component: JointAccountCreationComponent },
  { path: 'link-acc', component: LinkExistingAccountComponent },
  { path: 'metrices', component: MetricesComponent },
  { path: 'policy', component: PolicyComponent},
  { path: 'search/:id', component: SearchComponent },
  { path: 'verify', component: SocialLoginComponent },
  { path: 'sso-login', component: SsoLoginComponent },
  { path: 'followup', component: TeleconsultFollowupComponent },
  { path: 'consult-summary', component: TeleconsultSummaryComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'test', component: TestComponent },
  { path: 'affiliated-catogory-users', component: AffiliatedCategoryUsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
