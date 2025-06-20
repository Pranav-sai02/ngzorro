import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
  currentPage: string = ''; // Text for breadcrumb header
  currentRoute: string = ''; // Full route path
  showPopup: boolean = false; // Controls whether the popup is open

  // Routes where the "New" button should be hidden
  private hideButtonRoutes: string[] = [
    '/area-codes',
    '/service-provider/types',
    '/client-group',
    '/cases/case-details',
    '/home',
    '/dashboard',
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Set currentRoute initially and update on route changes
    this.currentRoute = this.router.url;
    this.updateBreadcrumb();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateBreadcrumb();
      });
  }

  // Build breadcrumb from route config or dynamic parameters
  // updateBreadcrumb(): void {
  //   const breadcrumbs: string[] = [];
  //   let route = this.activatedRoute.root;

  //   while (route.firstChild) {
  //     route = route.firstChild;
  //     const routeSnapshot = route.snapshot;

  //     if (routeSnapshot.data['breadcrumb']) {
  //       breadcrumbs.push(routeSnapshot.data['breadcrumb']);
  //     } else if (routeSnapshot.params['id']) {
  //       // Optional: fallback for dynamic ID-based routes
  //       breadcrumbs.push(`Details for ${routeSnapshot.params['id']}`);
  //     }
  //   }

  //   this.currentPage = breadcrumbs.join(' / ') || 'Dashboard / Home';
  // }
  updateBreadcrumb(): void {
    const breadcrumbs: string[] = [];
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
      const snapshot = route.snapshot;

      const breadcrumb = snapshot.data['breadcrumb'];
      if (breadcrumb) {
        breadcrumbs.push(breadcrumb);
      } else if (snapshot.params['id']) {
        breadcrumbs.push(`Details for ${snapshot.params['id']}`);
      }
    }

    this.currentPage = breadcrumbs.join(' / ') || 'Home';
  }

  // Show the floating popup
  openPopup(): void {
    this.showPopup = true;
  }

  // Hide the popup
  closePopup(): void {
    this.showPopup = false;
  }

  // Dynamically choose which popup component to display based on current route
  get activePopup(): string | null {
    if (this.currentRoute.includes('/users')) return 'users';
    if (this.currentRoute.includes('/service-provider/providers')) return 'service-providers';
    if (this.currentRoute.includes('/service-provider/types')) return 'service-provider-types';
    if (this.currentRoute.includes('/service-provider/services')) return 'services';
    if (this.currentRoute.includes('/client')) return 'client';
    if (this.currentRoute.includes('/cases')) return 'new';

    return null;
  }

  // Determine whether the "New" button should be shown
  get showNewButton(): boolean {
    return !this.hideButtonRoutes.some(route =>
      this.currentRoute.includes(route)
    );
  }
}
