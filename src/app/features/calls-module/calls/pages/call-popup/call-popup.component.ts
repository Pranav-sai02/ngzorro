import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-call-popup',
  standalone: false,
  templateUrl: './call-popup.component.html',
  styleUrl: './call-popup.component.css'
})
export class CallPopupComponent {
showPopup = false;
 @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit(); // 🔁 send close signal to parent
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
