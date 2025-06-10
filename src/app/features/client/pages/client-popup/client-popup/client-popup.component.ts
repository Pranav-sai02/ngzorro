import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../../services/client-service/client.service';
import { Client } from '../../../models/Client';

@Component({
  selector: 'app-client-popup',
  standalone: false,
  templateUrl: './client-popup.component.html',
  styleUrl: './client-popup.component.css'
})
export class ClientPopupComponent {
showSuccess = false;
 clientForm!: FormGroup;

  ProfileImage: String | ArrayBuffer | null = null;
  defaultImage =
    'https://static.vecteezy.com/system/resources/thumbnails/023/329/367/small/beautiful-image-in-nature-of-monarch-butterfly-on-lantana-flower-generative-ai-photo.jpg';

  @Output() close = new EventEmitter<void>();
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
  CompanyName: ['', Validators.required],
  ClientGroup: ['', Validators.required],
  Address: [''],
  AreaCode: [''],
  Telephone: ['', Validators.pattern(/^\d+$/)],
  Fax: [''],
  Mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  WebURL: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-])\/?$/i)],
  CompanyLogo: [''],
  IsActive: [true],
});
  }
  //  changePassword() {
  //   alert('Change password cliked');
  //  }

  closeForm() {
    this.close.emit();
  }
  onCancel(): void {
    this.close.emit();
  }
  //  onSave() {
  //   if (this.userForm.valid) {
  //     // proceed with form data…
  //     console.log(this.userForm.value);
  //     this.showSuccess = true;
  //     setTimeout(()=>this.showSuccess = false,3000);

  //     // this.closeForm();
  //   }
  //}

  // Handle image file selection
  toggleOptions: boolean = false;

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

  removeImage() {
    this.ProfileImage = '';
    this.toggleOptions = false;
  }

  // Stub for camera functionality (can be implemented via plugins if needed)
  openCamera() {
    alert('Camera functionality can be implemented via native device plugins.');
    this.toggleOptions = false;
  }

  clearField(controlName: string): void {
    this.userForm.get(controlName)?.setValue('');
  }

  onEditClick(): void {
  // Your logic here. For now, just log a message.
  console.log('Edit button clicked');
}


  onSave() {
  if (this.userForm.valid) {
    const formValues = this.userForm.value;

    const client: Client = {
        Name: formValues.Name,
        
        ClientGroup: formValues.ClientGroup,
        Address: formValues.Address,
        AreaCode: formValues.AreaCode,
        Telephone: formValues.Telephone,
        Fax: formValues.Fax,
        WebURL: formValues.WebURL,
        CompanyLogo: formValues.CompanyLogo,
        IsActive: formValues.IsActive,
        isDeleted: false,
     
    };

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
          this.toastr.error(messages, 'Validation Error', {
            enableHtml: true,
          });
        } else {
          this.toastr.error(
            err?.error?.message || 'Failed to save user',
            'Error'
          );
        }
      },
    });
  } else {
    this.userForm.markAllAsTouched();

    const errors: string[] = [];
    const nameControl = this.userForm.get('Name'); // Updated to Name
    const emailControl = this.userForm.get('UserEmail');
    const mobileNumberControl = this.userForm.get('MobileNumber');
    const phoneNumberControl = this.userForm.get('PhoneNumber');

    if (nameControl?.hasError('required')) {
      errors.push('Name is required.');
    }
    if (emailControl?.hasError('required')) {
      errors.push('Email is required.');
    } else if (emailControl?.hasError('email')) {
      errors.push('Please enter a valid email address.');
    }
    if (mobileNumberControl?.hasError('required')) {
      errors.push('Mobile Number is required.');
    } else if (mobileNumberControl?.hasError('pattern')) {
      errors.push('Please enter a valid 10-digit mobile number.');
    }
    if (phoneNumberControl?.hasError('pattern')) {
      errors.push('Please enter a valid 10-digit phone number.');
    }

    const errorMessage = errors.join('<br/>');
    this.toastr.error(errorMessage, 'Validation Error', { enableHtml: true });
  }
}
}
