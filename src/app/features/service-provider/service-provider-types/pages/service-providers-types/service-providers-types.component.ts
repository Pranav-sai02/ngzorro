// Angular core imports
import { Component, OnInit } from '@angular/core';

// AG Grid imports
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

// Model & Service imports
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { ServiceProviderTypesService } from '../../services/serviceProvider-types/service-provider-types.service';

// Custom AG Grid renderers
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

// Snackbar service for toast notifications
import { SnackbarService } from '../../../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-service-providers-types',
  standalone: false,
  templateUrl: './service-providers-types.component.html',
  styleUrl: './service-providers-types.component.css',
})
export class ServiceProvidersTypesComponent implements OnInit {
  // Custom renderer references for AG Grid
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  // Data array to hold service provider types
  ServiceProvidersTypes: ServiceProviderTypes[] = [];

  // Reference to AG Grid API
  private gridApi!: GridApi;

  // Column definitions for AG Grid
  columnDefs: ColDef<ServiceProviderTypes>[] = [
    {
      field: 'ServiceProvideCode',
      headerName: 'Code',
      flex: 1,
      minWidth: 90,
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 90,
      cellRenderer: 'activeToggleRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      headerName: 'Delete',
      flex: 1,
      minWidth: 150,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.softDelete(params.data),
    },
  ];

  // Default column properties
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private spSvc: ServiceProviderTypesService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Fetch data on component load
    this.spSvc.getAll().subscribe((data) => (this.ServiceProvidersTypes = data));
  }

  // AG Grid initialization
  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.onFitColumns();
  }

  // Auto-fit column widths
  onFitColumns() {
    this.gridApi?.sizeColumnsToFit();
  }

  // Perform soft delete (UI + backend)
  softDelete(row: ServiceProviderTypes): void {
    // Remove item from local list for UI update
    this.ServiceProvidersTypes = this.ServiceProvidersTypes.filter(
      r => r.ServiceProvideCode !== row.ServiceProvideCode
    );
    this.ServiceProvidersTypes = [...this.ServiceProvidersTypes]; // force Angular change detection

    // Show success notification
    this.snackbarService.showSuccess('Removed successfully');

    // Call backend to soft delete
    this.spSvc.softDeleteServiceProviderType(row.ServiceProviderId).subscribe({
      next: () => {
        // Optional: refresh or log success
      },
      // Uncomment to handle delete error
      // error: () => {
      //   this.snackbarService.showError('Soft delete failed');
      // }
    });
  }
}
