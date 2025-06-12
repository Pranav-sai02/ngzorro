import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedTab = 0;

  tabs = [
    { title: 'Caller' },
    { title: 'Validation' },
    { title: 'Voucher/SMS' },
    { title: 'Complaints' },
    { title: 'Documents' }
  ];

  selectTab(index: number): void {
    this.selectedTab = index;
  }

}
