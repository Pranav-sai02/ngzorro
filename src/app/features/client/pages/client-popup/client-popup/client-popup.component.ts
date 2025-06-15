import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../../services/client-service/client.service';
import { Client } from '../../../models/Client';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';

@Component({
  selector: 'app-client-popup',
  standalone: false,
  templateUrl: './client-popup.component.html',
  styleUrl: './client-popup.component.css',
})
export class ClientPopupComponent {
  // intl-tel-input settings
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  // Form for phone number validation
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required]),
  });

  // Optional search fields for country input
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  // Main client form
  clientForm!: FormGroup;

  // Image preview properties
  ProfileImage: String | ArrayBuffer | null = null;
  defaultImage = 'https://static.vecteezy.com/...';

  // Form control to toggle image upload options
  toggleOptions: boolean = false;

  // Output event to close the popup
  @Output() close = new EventEmitter<void>();

  // Form for additional user details (used in onSave logic)
  userForm!: FormGroup;

  // Flag for displaying success message
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // Initialize form with validation rules
    this.clientForm = this.fb.group({
      CompanyName: ['', Validators.required],
      ClientGroup: ['', Validators.required],
      Address: [''],
      AreaCode: ['', Validators.required],
      Telephone: [undefined, [Validators.required]],
      Fax: [undefined],
      Mobile: [undefined, [Validators.required]],
      WebURL: [
        '',
        Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-])\/?$/i),
      ],
      CompanyLogo: [''],
      IsActive: [true],
    });
  }

  // Close popup form
  closeForm() {
    this.close.emit();
  }

  // Cancel and close the popup
  onCancel(): void {
    this.close.emit();
  }

  // Handle image file upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.ProfileImage = reader.result as string;
        this.toggleOptions = false;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage() {
    this.ProfileImage = '';
    this.toggleOptions = false;
  }

  // Stub for native camera integration (can be replaced with plugin)
  openCamera() {
    alert('Camera functionality can be implemented via native device plugins.');
    this.toggleOptions = false;
  }

  // Clear value of any form field in userForm
  clearField(controlName: string): void {
    this.userForm.get(controlName)?.setValue('');
  }

  // Placeholder for future edit functionality
  onEditClick(): void {
    console.log('Edit button clicked');
  }

  // Save client form data
  onSave() {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;

      // Build client object to submit
      const client: Client = {
        ClientId: 0,
        ClientGroupId: 0,
        ClientGroup: {} as any,
        AreaCodeId: 0,
        AreaCodes: {} as any,
        ClientName: formValues.CompanyName,
        ClaimsManager: '',
        Address: formValues.Address,
        ClaimFormDeclaration: null,
        ClaimFormDeclarationPlain: null,
        Code: '',
        CompanyLogo: formValues.CompanyLogo,
        CompanyLogoData: null,
        DoTextExport: false,
        Fax: formValues.Fax,
        IsActive: formValues.IsActive,
        NearestClaimCentre: false,
        OtherValidationNotes: null,
        OtherValidationNotesPlain: null,
        PolicyFile: '',
        PolicyLabel: '',
        PolicyLookup: false,
        PolicyLookupFileData: null,
        PolicyLookupFileName: null,
        PolicyLookupPath: null,
        PrintName: formValues.CompanyName,
        ProcessClaims: false,
        Tel: formValues.Telephone,
        UseMembershipNumber: false,
        Validate: false,
        ValidationExternalFile: false,
        ValidationLabel1: null,
        ValidationLabel2: null,
        ValidationLabel3: null,
        ValidationLabel4: null,
        ValidationLabel5: null,
        ValidationLabel6: null,
        ValidationOther: false,
        ValidationWeb: false,
        WebURL: formValues.WebURL,
        WebValidationAVS: false,
        WebValidationOTH: false,
        WebValidationURL: '',
        EnableVoucherExportOnDeathClaim: false,
      };

      // Submit client creation request
      this.clientService.createClient(client).subscribe({
        next: () => {
          this.toastr.success('User saved successfully!', 'Success');
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
            this.closeForm();
          }, 3000);
        },
        error: (err) => {
          const errors = err?.error?.errors;
          if (errors) {
            const messages = Object.values(errors).flat().join('<br/>');
            this.toastr.error(messages, 'Validation Error', { enableHtml: true });
          } else {
            this.toastr.error(err?.error?.message || 'Failed to save user', 'Error');
          }
        },
      });
    } else {
      // Mark all fields as touched to show validation
      this.userForm.markAllAsTouched();

      const errors: string[] = [];

      // Manual validation with custom messages
      const nameControl = this.userForm.get('Name');
      const emailControl = this.userForm.get('UserEmail');
      const mobileNumberControl = this.userForm.get('MobileNumber');
      const phoneNumberControl = this.userForm.get('PhoneNumber');

      if (nameControl?.hasError('required')) errors.push('Name is required.');
      if (emailControl?.hasError('required')) errors.push('Email is required.');
      else if (emailControl?.hasError('email')) errors.push('Please enter a valid email address.');
      if (mobileNumberControl?.hasError('required')) errors.push('Mobile Number is required.');
      else if (mobileNumberControl?.hasError('pattern')) errors.push('Please enter a valid 10-digit mobile number.');
      if (phoneNumberControl?.hasError('pattern')) errors.push('Please enter a valid 10-digit phone number.');

      this.toastr.error(errors.join('<br/>'), 'Validation Error', { enableHtml: true });
    }
  }

  // Update preferred countries for intl-tel-input dropdown
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
}
