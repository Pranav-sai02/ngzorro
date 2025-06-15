import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-call-popup',
  standalone: false,
  templateUrl: './call-popup.component.html',
  styleUrl: './call-popup.component.css'
})
export class CallPopupComponent {
  // Controls the popup visibility
  showPopup = false;

  // Emits event to notify parent to close the popup
  @Output() close = new EventEmitter<void>();

  // Called when close button is clicked inside the popup
  onClose(): void {
    this.close.emit();
  }

  // Opens the popup
  openPopup(): void {
    this.showPopup = true;
  }

  // Closes the popup
  closePopup(): void {
    this.showPopup = false;
  }
}
