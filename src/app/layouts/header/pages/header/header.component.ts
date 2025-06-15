import { Component, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  currentDateTime: string = '';    // Full date & time (with seconds)
  currentDateOnly: string = '';    // Only date (without time)
  currentPage: string = '';        // Current route page title
  showDropdown: boolean = false;   // User dropdown visibility toggle

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setCurrentDateTime();   // Set initial date/time
    this.updateBreadcrumb();     // Set initial route title

    // Listen to route changes to update title dynamically
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });
  }

  // Format and set current date/time and just the date separately
  setCurrentDateTime(): void {
    const now = new Date();

    const fullOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long', month: 'short', day: '2-digit',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
      second: '2-digit', hour12: true,
    };

    const dateOnlyOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long', month: 'short', day: '2-digit', year: 'numeric',
    };

    this.currentDateTime = now.toLocaleDateString('en-US', fullOptions);
    this.currentDateOnly = now.toLocaleDateString('en-US', dateOnlyOptions);
  }

  // Toggle visibility of user dropdown menu
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    console.log('Dropdown toggled:', this.showDropdown);
  }

  // Logs user out and redirects to login
  logout(): void {
    console.log('Logging out...');
    this.showDropdown = false;
    localStorage.clear(); // Clear session/token
    this.router.navigate(['/login']);
  }

  // Confirm logout with native dialog before proceeding
  confirmLogout(event: MouseEvent): void {
    event.stopPropagation(); // Prevent dropdown close
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) this.logout();
    else console.log('Logout cancelled');
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  // Set breadcrumb title from activated route
  updateBreadcrumb(): void {
    let route = this.activatedRoute.root;
    let breadcrumb = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['breadcrumb']) {
        breadcrumb = route.snapshot.data['breadcrumb'];
      }
    }

    this.currentPage = breadcrumb || 'Dashboard / Home';
  }
}
