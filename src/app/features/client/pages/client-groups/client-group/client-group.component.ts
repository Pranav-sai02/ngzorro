import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';

import { ClientGroup } from '../../../models/ClientGroup';
import { AddClientGroup, LoadClientGroups } from '../../../client-group-state/client-group.action';
import { ClientGroupService } from '../../../services/client-group-services/client-group.service';
import { ClientGroupState } from '../../../client-group-state/client-group.state';

import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { SnackbarService } from '../../../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-client-group',
  standalone: false,
  templateUrl: './client-group.component.html',
  styleUrl: './client-group.component.css',
})
export class ClientGroupComponent implements OnInit {
  // Custom cell renderer references
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  gridApi!: GridApi; // AG Grid API reference
  ClientGroup: ClientGroup[] = []; // Holds current client group data

  // AG Grid column configuration
  columnDefs: ColDef<ClientGroup>[] = [
    {
      field: 'Name',
      headerName: 'Name',
      editable: true,
      cellEditor: 'agTextCellEditor',
      flex: 1,
      minWidth: 200,
      valueFormatter: (params) => (params.value ? params.value : 'Enter Name'),
      cellClassRules: {
        'hint-text': (params) => !params.value, // Highlight if name is empty
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      cellRenderer: 'activeToggleRenderer', // Uses toggle component
      flex: 1,
      minWidth: 120,
      headerClass: 'bold-header',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      headerName: 'Delete',
      field: 'IsDeleted',
      cellRenderer: 'softDeleteRenderer', // Uses soft delete component
      flex: 1,
      minWidth: 120,
      headerClass: 'bold-header',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
    },
    {
      headerName: 'Save',
      flex: 1,
      minWidth: 120,
      // Save button rendering (HTML + CSS)
      cellRenderer: () => {
        return `
          <style>
            .save-icon-btn:hover .save-icon {
              transform: scale(1.2);
            }
          </style>
          <button class="save-icon-btn" style="background-color: white; color: #333; border: none; border-radius: 8px; font-weight: 500; height: 42px; display: flex; align-items: center; justify-content: center; padding: 0 14px; font-size: 1rem; gap: 8px; cursor: pointer;">
            <i class="fas fa-save save-icon" style="color: #28a745; font-size: 1.2rem; transition: transform 0.3s ease;"></i>
          </button>`;
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.saveRow(params.data),
    },
  ];

  // Default column properties
  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
  };

  constructor(
    private store: Store,
    private clientGroupService: ClientGroupService,
    private snackbarService: SnackbarService
  ) {}

  // Load initial data on component mount
  ngOnInit(): void {
    this.store.dispatch(new LoadClientGroups());
    this.store.select(ClientGroupState.getClientGroups).subscribe((data) => {
      this.ClientGroup = data;
    });
  }

  // AG Grid ready event handler
  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  // Called when cell value is changed
  onCellValueChanged(event: CellValueChangedEvent): void {
    const updatedRow = event.data;
    const index = this.ClientGroup.findIndex(
      (r) => r === updatedRow || r.ClientGroupId === updatedRow.ClientGroupId
    );

    if (index > -1) {
      this.ClientGroup[index].IsEdited = true; // Mark row as edited
      this.gridApi.applyTransaction({ update: [this.ClientGroup[index]] });
    }
  }

  // Save a row (new or edited)
  saveRow(row: ClientGroup): void {
    const isComplete = row.Name?.trim() && row.IsActive !== null && row.IsActive !== undefined;

    if (!isComplete) {
      this.snackbarService.showError('Please complete all fields before saving.');
      return;
    }

    const isNew = !row.ClientGroupId;

    if (!isNew && !row.IsEdited) {
      this.snackbarService.showInfo('No changes to save.');
      return;
    }

    const saveObservable = isNew
      ? this.clientGroupService.addClientGroup(row)
      : this.clientGroupService.updateClientGroup(row);

    saveObservable.subscribe({
      next: (savedRow: ClientGroup) => {
        this.snackbarService.showSuccess('Saved successfully!');

        if (isNew && savedRow?.ClientGroupId) {
          row.ClientGroupId = savedRow.ClientGroupId; // Assign new ID
        }

        row.IsEdited = false;

        this.gridApi.applyTransaction({ update: [row] }); // Update grid row
        this.store.dispatch(new LoadClientGroups()); // Refresh state

        // Optional redraw
        setTimeout(() => {
          this.gridApi.redrawRows();
        }, 100);
      },
      error: () => {
        this.snackbarService.showError('Failed to save. Try again.');
      },
    });
  }

  // Highlight temporary rows (new rows)
  getRowClass = (params: any) => {
    return !params.data.ClientGroupId ? 'temporary-row' : '';
  };

  // Soft delete a row (from UI only)
  softDeleteProvider(clientGroup: ClientGroup): void {
    this.ClientGroup = this.ClientGroup.filter(
      (group) => group.ClientGroupId !== clientGroup.ClientGroupId
    );
    this.snackbarService.showSuccess('Removed successfully!');
  }

  // Add new temporary row
  addRow(): void {
    const newRow: ClientGroup = {
      Name: '',
      IsActive: true,
    };
    this.store.dispatch(new AddClientGroup(newRow));
  }

  // Context menu options (right-click)
  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    const addRow = {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    };

    const deleteRow = {
      name: 'Delete Row',
      action: () => {
        if (params.node) {
          this.softDeleteProvider(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };
}
