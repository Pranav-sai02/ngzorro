import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../models/Sidebar';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  groupedMenu: { [section: string]: Sidebar[] } = {}; // Grouped menu items by section
  topLevelMenuItems: Sidebar[] = []; // Items like Home/Dashboard shown outside group
   isCollapsed: boolean = true;// sidebar starts collapsed

  // Display order for sidebar sections
  sectionOrder: string[] = [
    'Call Centre',
    'Configuration',
    'Company',
    'Rating Questions',
    'Client',
    'Services',
    'Transport',
    'Admin',
    'Import',
    'Reports',
    'Sms',
    'Security',
    'General', // Fallback/default group
  ];

  list!: [
    'Call Centre',
    'Configuration',
    'Company',
    'Rating Questions',
    'Client',
    'Services',
    'Transport',
    'Admin',
    'Import',
    'Reports',
    'Sms',
    'Security',
    'General'
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Fetch sidebar menu items from the service
    this.sidebarService.getMenuItems().subscribe({
      next: (items) => {
        const activeItems = items.filter((item) => item.IsActive); // Only show active

        // Top-level items (e.g., Home or Dashboard)
        this.topLevelMenuItems = activeItems.filter(
          (item) => item.MenuPath === 'Home' || item.MenuPath === 'DashBoard'
        );

        // Groupable sub-items (with path structure like "Configuration/Settings")
        const groupableItems = activeItems
          .filter(
            (item) =>
              item.MenuPath.includes('/') &&
              !this.topLevelMenuItems.includes(item)
          )
          .sort((a, b) => a.MenuId - b.MenuId); // Optional sorting

        // Group items by first path segment
        this.groupedMenu = this.groupBySection(groupableItems);
      },
      error: (err) => {
        console.error('Error fetching sidebar menu items:', err);
      },
    });
  }

  // Group sidebar items by their first path segment
  private groupBySection(items: Sidebar[]): { [section: string]: Sidebar[] } {
    const grouped: { [section: string]: Sidebar[] } = {};

    items.forEach((item) => {
      const pathParts = item.MenuPath.split('/');
      const section = pathParts.length > 1 ? pathParts[0] : 'General';

      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(item);
    });

    // Sort items within each section by MenuId
    Object.keys(grouped).forEach((section) => {
      grouped[section].sort((a, b) => a.MenuId - b.MenuId);
    });

    return grouped;
  }
}
