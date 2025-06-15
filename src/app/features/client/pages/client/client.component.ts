import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { Client } from '../../models/Client';
import { ClientService } from '../../services/client-service/client.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  // === AG Grid Renderer References ===
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  softDeleteRenderer = SoftDeleteButtonRendererComponent;

  // === Class Properties ===
  Client: Client[] = [];
  selectedUser: Client | null = null;
  editedUser: Client = {} as Client;
  toggleOptions = false;
  saving = false;
  gridApi!: GridApi;

  // === AG Grid Config ===
  gridOptions: GridOptions = {
    context: { componentParent: this },
    getRowId: (params) => params.data.id?.toString() ?? params.data.name,
    pagination: true,
    paginationPageSize: 20,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'single',
    rowClassRules: {
      'temporary-row': (params) => params.data?.Name?.includes('(INACTIVE)'),
    },
  };

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  components = {
    activeToggleRenderer: ActiveToggleRendererComponent,
  };

  // === AG Grid Column Definitions ===
  columnDefs: ColDef<Client>[] = [
    {
      field: 'ClientName',
      headerName: 'Name',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'ClaimsManager',
      headerName: 'Claims Manager',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'ClientGroup',
      valueGetter: (params) => params.data?.ClientGroup?.Name ?? '',
      headerName: 'Group Name',
      minWidth: 230,
      flex: 2,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'AreaCodes',
      valueGetter: (params) => params.data?.AreaCodes?.AreaCode ?? '',
      headerName: 'Area Code',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'Tel',
      headerName: 'Telephone',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      minWidth: 150,
      flex: 1,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: { onChange: this.onActiveToggleChange.bind(this) },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      sortable: true,
      filter: true,
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

  constructor(
    private clientService: ClientService,
    private snackbarService: SnackbarService
  ) {}

  // === Lifecycle Hook ===
  ngOnInit(): void {
    this.loadUsers();
  }

  // === Grid Events ===
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }

  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'clients.csv',
      columnSeparator: ',',
      allColumns: true,
    });
  }

  // === Data Load ===
  loadUsers(): void {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.Client = data;
        this.resizeGrid();
      },
      error: (err: any) => {
        console.error('Failed to load clients', err);
      },
    });
  }

  // === Popup Handlers ===
  openPopup(user: Client): void {
    this.selectedUser = user;
    this.editedUser = { ...user };
    this.toggleOptions = false;
  }

  closePopup(): void {
    this.selectedUser = null;
    this.editedUser = {} as Client;
  }

  // === Grid Actions ===
  onActiveToggleChange(params: any): void {
    const updatedUser = params.data as Client;
    // Placeholder: handle active status update
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }

  clearField(field: keyof Client): void {
    if (field in this.editedUser) {
      (this.editedUser as any)[field] = '';
    }
  }

  softDelete(client: Client): void {
    client.IsDeleted = true;
    this.Client = this.Client.filter(c => c.ClientId !== client.ClientId);
    this.snackbarService.showSuccess('Removed successfully');
  }
}
