import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../models/Sidebar';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  public topLevelMenuItems: Sidebar[] = []; // Items like Home/Dashboard
  public groupedMenu: { [section: string]: Sidebar[] } = {}; // Grouped submenus
  public isCollapsed: boolean = true; // Sidebar starts collapsed

  // Section order used to render grouped menus in fixed order
  public sectionOrder: string[] = [
    'Call Centre',
    'Configuration',
    'Company',
    'Rating Questions',
    'cases',
    'Client',
    'Services',
    'Transport',
    'Admin',
    'Import',
    'Reports',
    'Sms',
    'Security',
    'General' // fallback group
  ];

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  // Fetch and process menu items
  private loadMenuItems(): void {
    this.sidebarService.getMenuItems().subscribe({
      next: (items: Sidebar[]) => {
        const activeItems = items.filter(item => item.IsActive);

        // Top-level menu: Home or Dashboard
        this.topLevelMenuItems = activeItems.filter(item =>
          ['Home', 'DashBoard'].includes(item.MenuPath)
        );

        // Grouped menu items (like Configuration/Settings)
        const groupableItems = activeItems
          .filter(item =>
            item.MenuPath.includes('/') && !this.topLevelMenuItems.includes(item)
          )
          .sort((a, b) => a.MenuId - b.MenuId);

        this.groupedMenu = this.groupBySection(groupableItems);
      },
      error: (error) => {
        console.error('❌ Failed to load sidebar menu items:', error);
      }
    });
  }

  // Group menu items by their first path segment (e.g., 'Configuration/Settings' -> 'Configuration')
  private groupBySection(items: Sidebar[]): { [section: string]: Sidebar[] } {
    const grouped: { [section: string]: Sidebar[] } = {};

    items.forEach(item => {
      const pathParts = item.MenuPath.split('/');
      const sectionKey = pathParts[0] || 'General';
      const section = sectionKey === 'Cases' ? 'Call Centre' :
        this.sectionOrder.includes(sectionKey) ? sectionKey : 'General';

      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(item);
    });

    // Sort within each group by MenuId
    for (const section in grouped) {
      grouped[section].sort((a, b) => a.MenuId - b.MenuId);
    }

    return grouped;
  }

  // trackBy function for better ngFor performance
  public trackByMenuId(index: number, item: Sidebar): number {
    return item.MenuId;
  }
}