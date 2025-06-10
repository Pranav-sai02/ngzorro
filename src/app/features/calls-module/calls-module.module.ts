import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsModuleRoutingModule } from './calls-module-routing.module';
import { CallsComponent } from './calls/pages/calls/calls.component';
import { CallDetailsComponent } from './call-details/pages/call-details/call-details.component';
import { AgGridModule } from 'ag-grid-angular';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { provideNzI18n } from 'ng-zorro-antd/i18n';

@NgModule({
  declarations: [CallsComponent, CallDetailsComponent,  ],
  imports: [
    CommonModule,
    CallsModuleRoutingModule,
    AgGridModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
     NzButtonModule,//for ng-zorro
    NzInputModule,//for ng-zorro
    NzFormModule,//for ng-zorro
    NzIconModule,//for ng-zorro
     NzStepsModule,//for ng-zorro
  ],
  exports: [CallsComponent, CallDetailsComponent],
})
export class CallsModuleModule {}
