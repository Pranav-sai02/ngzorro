import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { Claim } from '../../models/Claim';
import { ClaimsService } from '../../services/claims.service';

@Component({
  selector: 'app-claims',
  standalone: false,
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.css',
})
export class ClaimsComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular; // Reference to the ag-grid component

  // Column definitions for the AG Grid
  columnDefs: ColDef[] = [
    { headerName: 'Status', field: 'status', sortable: true, filter: true },
    { headerName: 'Progress', field: 'progress', sortable: true, filter: true },
    { headerName: 'Claim Ref #', field: 'claimRef', sortable: true, filter: true },
    { headerName: 'Call Ref #', field: 'callRef', sortable: true, filter: true },
    {
      headerName: 'Claim Date',
      field: 'claimDate',
      sortable: true,
      filter: true,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(), // Format date
    },
    { headerName: 'Claimant', field: 'claimantName', sortable: true, filter: true },
    { headerName: 'Deceased', field: 'deceasedName', sortable: true, filter: true },
    { headerName: 'Policy', field: 'policyNumber', sortable: true, filter: true },
  ];

  rowData: Claim[] = []; // Data to populate the grid
  gridApi!: GridApi; // AG Grid API instance
  gridOptions: GridOptions = {}; // Optional grid configuration

  constructor(private claimService: ClaimsService) {}

  // Load claims data on component initialization
  ngOnInit(): void {
    this.claimService.getClaims().subscribe((data) => {
      this.rowData = data;
    });
  }

  // Save AG Grid API reference when the grid is ready
  onGridReady(params: any): void {
    this.gridApi = params.api;
    console.log('AG Grid is ready', params);
  }

  // Export current grid data as CSV
  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'claims.csv',
      columnSeparator: ',',
      allColumns: true,
    });
  }
}
