import { Component } from '@angular/core';

@Component({
  selector: 'app-complaints',
  standalone: false,
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css',
})
export class ComplaintsComponent {
  // Trigger browser print dialog
  printPage(): void {
    window.print();
  }
}
