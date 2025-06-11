import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-caller-details',
  standalone: false,
  templateUrl: './caller-details.component.html',
  styleUrl: './caller-details.component.css'
})
export class CallerDetailsComponent implements OnInit {
  setActiveTab(tab: string): void {
  this.activeTab = tab;
}
  activeTab: string = 'caller';
   callerForm!: FormGroup;

  clients: string[] = ['Client A', 'Client B', 'Client C'];
  serviceTypes: string[] = ['Service A', 'Service B', 'Service C'];
  languages: string[] = ['English', 'Afrikaans', 'Zulu', 'Xhosa'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.callerForm = this.fb.group({
      client: [''],
      serviceType: [''],
      consent: [''],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      isPolicyHolder: [''],
      agent: [''],
      callOpenDate: [''],
      language: [''],
      refGiven: [''],
    });
  }
  onSubmit(): void {
  if (this.callerForm.valid) {
    console.log(this.callerForm.value);
  }
}
}
