import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../constants/south-african-languages';
import { Call } from '../../../calls/models/Cases';
import { ClientService } from '../../../../client/services/client-service/client.service';
import { CallDataService } from '../../../calls/services/call-data-service/call-data.service';

@Component({
  selector: 'app-caller-details',
  standalone: false,
  templateUrl: './caller-details.component.html',
  styleUrl: './caller-details.component.css',
})
export class CallerDetailsComponent implements OnInit {
  // Public form and state
  callerForm!: FormGroup;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  // Form options
  languages = SOUTH_AFRICAN_LANGUAGES;
  serviceTypes: string[] = ['Service A', 'Service B', 'Service C'];

  // Query param data
  caseRef!: string;
  callerName = '';
  client = '';

  // Selected call data from service
  caseData: Call | null = null;

  // Phone input config
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.SouthAfrica, CountryISO.UnitedStates];
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  // Tab tracking
  activeTab = 'caller';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private callDataService: CallDataService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Load route query params
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      this.client = params.get('client') ?? '';
    });

    // Init caller form
    this.callerForm = this.fb.group({
      client: [this.client || ''],
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

  // Handle form submission
  onSubmit(): void {
    if (this.callerForm.valid) {
      console.log(this.callerForm.value);
    }
  }

  // Change preferred countries dynamically
  changePreferredCountries(): void {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  // Set tab manually if needed
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Placeholder for year range logic
  getYearRange(): void {
    throw new Error('Method not implemented.');
  }
}
