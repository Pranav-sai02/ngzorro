import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasesComponent } from './calls/pages/cases/cases.component';
import { CallDetailsComponent } from './call-details/pages/call-details/call-details.component';
import { CallPopupComponent } from './calls/pages/call-popup/call-popup.component';

const routes: Routes = [
  // Add your routes here
  {
    path: '',
    component: CasesComponent, // 👈 Load this when path is '/calls'
    title: 'Cases',
    data: { breadcrumb: 'Call Centre / Cases' },
  },
  {
    path: 'case-details', // No :callRef
    component: CallDetailsComponent,
    title: 'Case Details',
    data: { breadcrumb: 'Call Centre / Cases / Case Details' },
  },
  {
  path: 'new',
  component: CallPopupComponent,
  title: 'New Case',
  data: { breadcrumb: 'Call Centre / Cases / New Case' }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallsModuleRoutingModule {}
