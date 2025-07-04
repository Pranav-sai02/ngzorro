import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';

import { ServicesPage } from '../../models/Services-page';
import { ServicesPageService } from '../../services/service-page/services-page.service';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { SnackbarService } from '../../../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-services-page',
  standalone: false,
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css',
})
export class ServicesPageComponent {
  // Public properties
  ServicePage: ServicesPage[] = [];
  showPopup = false; // Controls popup visibility
  selectedService: ServicesPage | null = null; // Selected item for editing popup

  // Renderer components
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  // Column definitions for AG Grid
  columnDefs: ColDef<ServicesPage>[] = [
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'ServiceType',
      headerName: 'Service Type',
      sortable: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'NotePlain',
      headerName: 'Note Plain',
      flex: 1,
      minWidth: 120,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'EnforceMobileNumber',
      headerName: 'Enforce Mobile',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const imagePath = params.value ? 'assets/icons/tick.png' : 'assets/icons/cross.png';
        return `<img src="${imagePath}" alt="${params.value ? 'Yes' : 'No'}" style="width: 20px; height: 20px;" />`;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'SendRefSMSEnabled',
      headerName: 'Send Ref SMS',
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: any) => {
        const imagePath = params.value ? 'assets/icons/tick.png' : 'assets/icons/cross.png';
        return `<img src="${imagePath}" alt="${params.value ? 'Yes' : 'No'}" style="width: 20px; height: 20px;" />`;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 120,
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
      headerName: 'View',
      minWidth: 150,
      flex: 1,
      cellRenderer: (_: ICellRendererParams) =>
        '<i class="fas fa-eye" title="Can View / Edit" style="color: green; cursor: pointer;"></i>',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
      },
      onCellClicked: (params: any) => this.openPopup(params.data),
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

  // Default column settings
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // Private variables
  private gridApi!: GridApi;

  constructor(
    private ServicesPageService: ServicesPageService,
    private snackbarService: SnackbarService
  ) {}

  // Lifecycle hook
  ngOnInit(): void {
    this.ServicesPageService.getAll().subscribe((data) => {
      this.ServicePage = data;
      setTimeout(() => this.autoSizeColumnsBasedOnContent(), 0);
    });
  }

  // AG Grid ready callback
  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.autoSizeColumnsBasedOnContent();
  }

  // Adjust column widths based on excluded fields
  onFitColumns() {
    if (!this.gridApi) return;

    const allColDefs = this.gridApi.getColumnDefs() ?? [];

    const allFields = allColDefs
      .filter((colDef): colDef is ColDef => !!(colDef as ColDef).field)
      .map((colDef) => (colDef as ColDef).field!);

    const columnsToFit = allFields.filter(
      (field) =>
        ![
          'Description',
          'ServiceType',
          'Note',
          'NotePlain',
          'EnforceMobileNumber',
          'SendRefSMSEnabled',
          'IsActive',
        ].includes(field)
    );

    if (columnsToFit.length) {
      this.gridApi.autoSizeColumns(columnsToFit, false);
    }
  }

  // Auto-size selected columns based on content
  autoSizeColumnsBasedOnContent() {
    if (!this.gridApi) return;

    const columnsToAutoSize = [
      'Description',
      'ServiceType',
      'Note',
      'NotePlain',
      'EnforceMobileNumber',
      'SendRefSMSEnabled',
      'IsActive',
    ];
    this.gridApi.autoSizeColumns(columnsToAutoSize, false);
  }

  // Open popup for viewing/editing a service
  openPopup(service: ServicesPage): void {
    this.selectedService = service;
    this.showPopup = true;
  }

  // Close popup
  closePopup(): void {
    this.showPopup = false;
    this.selectedService = null;
  }

  // Handle form submission from popup
  onServiceFormSubmit(updatedService: ServicesPage): void {
    const index = this.ServicePage.findIndex(
      (s) => s.ServiceId === updatedService.ServiceId
    );

    if (index > -1) {
      this.ServicePage[index] = updatedService;
      this.ServicePage = [...this.ServicePage]; // Force Angular change detection
      this.gridApi.refreshCells(); // Optionally refresh
    }

    this.closePopup();
  }

  // Soft delete service from grid
  softDelete(service: ServicesPage): void {
    service.IsDeleted = true;

    this.ServicePage = this.ServicePage.filter(
      (item) => item.ServiceId !== service.ServiceId
    );

    this.snackbarService.showSuccess('Removed successfully');
  }
}
