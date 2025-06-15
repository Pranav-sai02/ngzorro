import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

import { SOUTH_AFRICAN_LANGUAGES } from '../../../../../constants/south-african-languages';
import { Call } from '../../../calls/models/Call';
import { CallDataService } from '../../../calls/services/call-data-service/call-data.service';
import { ClientService } from '../../../../client/services/client-service/client.service';

@Component({
  selector: 'app-call-details',
  standalone: false,
  templateUrl: './call-details.component.html',
  styleUrl: './call-details.component.css',
})
export class CallDetailsComponent implements OnInit {
  // Public properties
  languages = SOUTH_AFRICAN_LANGUAGES;
  callerName = '';
  client = '';
  caseRef!: string;
  callerForm!: FormGroup;
  caseData: Call | null = null;

  selectedTab = 0;
  activeTab = 'caller'; // legacy reference if needed elsewhere
  clients: string[] = ['AUL-FUNER SCHEMES (INACTIVE)'];
  clientNames: string[] = [];
  serviceTypes: string[] = ['AVS-Legal Assist', 'Service Type B', 'Service Type C'];

  // Phone input config
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  // Stepper config
  isLinear = true;
  activeIndex = 0;
  completedSteps: boolean[] = [false, false, false, false, false];

  tabs = [
    { label: 'Caller' },
    { label: 'Validation' },
    { label: 'Voucher/SMS' },
    { label: 'Complaints' },
    { label: 'Documents' },
  ];

  // Optional dynamic values
  agents: any;
  callOpenDates: any;
  today: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private callDataService: CallDataService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Read query params passed during routing
    this.route.queryParamMap.subscribe((params) => {
      this.caseRef = params.get('callRef') ?? '';
      this.callerName = params.get('callerName') ?? '';
      this.client = params.get('client') ?? '';
    });

    // Initialize caller form with default values
    this.callerForm = this.fb.group({
      client: [this.client || '1Life-Agency1'],
      serviceType: ['AVS-Legal Assist'],
      firstName: [''],
      secondName: [''],
      callbackNumber: [''],
      consent: [''],
      isPolicyHolder: [''],
      language: [''],
      refGiven: [''],
      callOpenDate: [''],
    });

    // Optionally get shared call data
    this.caseData = this.callDataService.getSelectedCall();
  }

  // Change active tab in UI
  selectTab(index: number): void {
    this.selectedTab = index;
  }

  // Update stepper progress
  completeStep(stepper: MatStepper): void {
    this.completedSteps[this.activeIndex] = true;
    stepper.next();
  }

  // Reset stepper to initial state
  resetStepper(stepper: MatStepper): void {
    this.completedSteps = [false, false, false, false, false];
    this.activeIndex = 0;
    stepper.reset();
  }

  // Placeholder for future feature
  getYearRange(): void {
    throw new Error('Method not implemented.');
  }

  // Change preferred countries for phone input dynamically
  changePreferredCountries(): void {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
}
