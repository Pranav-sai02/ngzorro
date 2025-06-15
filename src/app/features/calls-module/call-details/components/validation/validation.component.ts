import { Component } from '@angular/core';

@Component({
  selector: 'app-validation',
  standalone: false,
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css',
})
export class ValidationComponent {
  // Current validation form data
  validation = {
    policyNumber: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    relationship: '',
    fusionDb: false,
    websiteVerification: false,
    memberCertificate: false,
    telephonically: false,
    otherMethod: '',
    validationMethod: '',
    benefitValid: '',
  };

  // Holds last validation summary
  previousValidation = {
    method: '',
    date: '',
    validatedBy: '',
    benefitValid: false,
  };

  // Generate validation summary and store it in previousValidation
  onValidate(): void {
    const methods = [];

    if (this.validation.fusionDb) methods.push('Fusion Database');
    if (this.validation.websiteVerification) methods.push('Website Verification');
    if (this.validation.memberCertificate) methods.push('Member Certificate');
    if (this.validation.telephonically) methods.push('Telephonically');
    if (this.validation.otherMethod) methods.push(this.validation.otherMethod);

    this.previousValidation = {
      method: methods.join(', ') || 'None',
      date: new Date().toLocaleDateString(),
      validatedBy: 'Admin', // Static for now; can be dynamic in future
      benefitValid: this.validation.benefitValid === 'yes',
    };
  }
}
