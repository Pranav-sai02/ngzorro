import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-areacode-popup',
  standalone: false,
  templateUrl: './areacode-popup.component.html',
  styleUrl: './areacode-popup.component.css',
})
export class AreacodePopupComponent {
  // Form group for the area code form
  areaForm: FormGroup;

  // Emit when the popup should close
  @Output() close = new EventEmitter<void>();

  // Emit when form is submitted successfully
  @Output() formSubmit = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private areaCodeService: AreaCodesService,
    private toastr: ToastrService
  ) {
    // Initialize the form
    this.areaForm = this.fb.group({
      areaCode: ['', Validators.required],
      description: [''],
      type: ['Landline'],
      isActive: [false],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      this.toastr.error('Please fill in required fields.', 'Form Invalid');
      return;
    }

    const formData = this.areaForm.value;

    this.areaCodeService.addAreaCode(formData).subscribe({
      next: (response) => {
        this.toastr.success('Area code saved successfully!', 'Success');
        this.formSubmit.emit(response);
        this.close.emit();
      },
      error: (err) => {
        console.error('Save error:', err);
        this.toastr.error('Failed to save area code.', 'Error');
      },
    });
  }

  // Cancel and close the popup
  onCancel() {
    this.close.emit();
  }

  // Close the popup
  onClose() {
    this.close.emit();
  }

  // Expose form controls for easy access in template
  get f() {
    return this.areaForm.controls;
  }
}
