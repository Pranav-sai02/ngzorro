import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridOptions, ICellRendererParams, CellClickedEvent } from 'ag-grid-community';

import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { Call } from '../../models/Call';
import { CallsService } from '../../services/call-services/calls.service';
import { CallDataService } from '../../services/call-data-service/call-data.service';

@Component({
  selector: 'app-calls',
  standalone: false,
  templateUrl: './calls.component.html',
  styleUrl: './calls.component.css',
})
export class CallsComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;

  Cases: Call[] = [];
  gridApi!: GridApi;

  // Column configuration for AG Grid
  columnDefs: ColDef<Call>[] = [
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'caseRef',
      headerName: 'Case Reference Number',
      filter: 'agTextColumnFilter',
      minWidth: 250,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        `<a style="color:blue;cursor:pointer;text-decoration:underline;">${params.value}</a>`,
      onCellClicked: (event: CellClickedEvent) => {
        const selectedCall = event.data;
        this.callDataService.setSelectedCall(selectedCall);

        const queryParams = {
          callRef: selectedCall.caseRef,
          callerName: `${selectedCall.callerFirstName} ${selectedCall.callerLastName}`,
          client: selectedCall.client,
        };

        this.router.navigate(['/cases/case-details'], { queryParams });
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'caseNo',
      headerName: 'Case Number',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'caseDate',
      headerName: 'Case Date',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 2,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'callerName',
      headerName: 'Caller Name',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'deceasedName',
      headerName: 'Deceased Name',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'client',
      headerName: 'Client',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'type',
      headerName: 'Type',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'funeralDate',
      headerName: 'Funeral Date',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private callService: CallsService,
    private router: Router,
    private callDataService: CallDataService
  ) {}

  // === Lifecycle ===
  ngOnInit(): void {
    this.loadUsers();
  }

  // === Grid Events ===

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  onGridSizeChanged(): void {
    this.onFitColumns();
  }

  onFitColumns(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  // === Data Operations ===

  loadUsers(): void {
    this.callService.getUsers().subscribe((data) => {
      this.Cases = data;
      this.resizeGrid();
    });
  }

  // === Row Click Navigation ===

  onRowClicked(event: any): void {
    const call: Call = event.data;

    this.callDataService.setSelectedCall(call); // Optionally persist selected call

    const queryParams = {
      callRef: call.caseRef,
      callerName: `${call.callerFirstName} ${call.callerLastName}`,
      client: call.client,
    };

    this.router.navigate(['/cases/case-details'], { queryParams });
  }

  // === Helpers ===

  private resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }
}
