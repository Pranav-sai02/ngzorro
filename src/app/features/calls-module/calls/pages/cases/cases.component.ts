import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ColDef,
  GridApi,
  ICellRendererParams,
  CellClickedEvent,
  GridReadyEvent
} from 'ag-grid-community';

import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { Call } from '../../models/Cases';
import { CallViewModel } from '../../models/CallViewModel';
import { CallsService } from '../../services/call-services/calls.service';
import { CallDataService } from '../../services/call-data-service/call-data.service';

@Component({
  selector: 'app-calls',
  standalone: false,
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css',
})
export class CasesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;

  Cases: CallViewModel[] = []; // ViewModel for displaying in grid
  private calls: Call[] = [];   // Full data used internally

  gridApi!: GridApi;

  // === AG Grid Columns ===
  columnDefs: ColDef<CallViewModel>[] = [
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
        const viewModel: CallViewModel = event.data;
        const selectedCall = this.calls.find(
          c => c.CaseReferenceNumber === viewModel.caseRef
        );
        if (selectedCall) {
          this.callDataService.setSelectedCall(selectedCall);
          this.router.navigate(['/cases/case-details'], {
            queryParams: {
              callRef: viewModel.caseRef,
              callerName: viewModel.callerName,
              client: viewModel.client,
            },
          });
        }
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
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  onGridSizeChanged(): void {
    this.onFitColumns();
  }

  onFitColumns(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  // === Data Fetching and Mapping ===
  loadUsers(): void {
    this.callService.getUsers().subscribe((data: Call[]) => {
      this.calls = data;

      this.Cases = data.map((call) => ({
        status: call.CaseStatus,
        caseRef: call.CaseReferenceNumber,
        caseNo: call.CaseNumber,
        caseDate: call.CaseCreatedDate,
        callerName: call.CaseCaller
          ? `${call.CaseCaller.CallerFirstName} ${call.CaseCaller.CallerLastName}`
          : '',
        deceasedName: '', // Can be populated later
        client: call.ClientId?.toString() ?? 'N/A',
        type: '', // Can be populated later
        funeralDate: '', // Can be populated later
      }));

      this.resizeGrid();
    });
  }

  // === Optional Row Click Handler (if used separately) ===
  onRowClicked(event: any): void {
    const viewModel: CallViewModel = event.data;
    const fullCall = this.calls.find(
      c => c.CaseReferenceNumber === viewModel.caseRef
    );

    if (fullCall) {
      this.callDataService.setSelectedCall(fullCall);
      this.router.navigate(['/cases/case-details'], {
        queryParams: {
          callRef: viewModel.caseRef,
          callerName: viewModel.callerName,
          client: viewModel.client,
        },
      });
    }
  }

  // === Grid Resize Helper ===
  private resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }
}
