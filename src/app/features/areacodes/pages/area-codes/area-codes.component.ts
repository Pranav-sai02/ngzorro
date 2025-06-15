import { Component, OnInit } from '@angular/core';
import { CellValueChangedEvent, ColDef, GetContextMenuItems, GetContextMenuItemsParams, GridApi } from 'ag-grid-community';
import { Store } from '@ngxs/store';

import { AreaCodes } from '../../models/AreaCodes';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';

import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

import { AddAreaCodeRowLocally, LoadAreaCodes, SoftDeleteAreaCode, UpdateAreaCode } from '../../state/area-code.actions';
import { AreaCodesState } from '../../state/area-code.state';

@Component({
  selector: 'app-area-codes',
  standalone: false,
  templateUrl: './area-codes.component.html',
  styleUrls: ['./area-codes.component.css'],
})
export class AreaCodesComponent implements OnInit {
  // Renderer component references for AG Grid
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;

  // Grid and data
  public gridApi!: GridApi;
  public AreaCode: AreaCodes[] = [];

  // Grid column definitions
  public columnDefs: ColDef<AreaCodes>[] = [
    {
      field: 'AreaCode',
      headerName: 'Code',
      sortable: true,
      flex: 1,
      maxWidth: 150,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value ? params.value : 'Enter Areacode',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value ? params.value : 'Enter Country/Region',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Type',
      headerName: 'Type',
      sortable: true,
      flex: 1,
      minWidth: 180,
      editable: true,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['Landline', 'Mobile', 'International'],
      },
      valueFormatter: (params) => params.value ? params.value : 'Select Type',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc' },
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
      headerName: 'Delete',
      flex: 1,
      minWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
    },
    {
      headerName: 'Save',
      flex: 1,
      minWidth: 120,
      cellRenderer: () => {
        return `
          <style>
            .save-icon-btn:hover .save-icon {
              transform: scale(1.2);
            }
          </style>
          <button class="save-icon-btn" style="background-color: white; color: #333; border: none; border-radius: 8px; font-weight: 500; height: 42px; display: flex; align-items: center; justify-content: center; padding: 0 14px; font-size: 1rem; gap: 8px; cursor: pointer;">
            <i class="fas fa-save save-icon" style="color: #28a745; font-size: 1.2rem; transition: transform 0.3s ease;"></i>
          </button>
        `;
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

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private store: Store,
    private areaCodesService: AreaCodesService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadAreaCodes());
    this.store.select(AreaCodesState.getAreaCodes).subscribe((data) => {
      this.AreaCode = data;
    });
  }

  // Initialize grid API
  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  // Handle inline cell edit changes
  onCellValueChanged(event: CellValueChangedEvent): void {
    const row = event.data;
    const newValue = row.AreaCode?.trim();

    if (!newValue) {
      row.AreaCode = '';
      row.isEdited = true;
      this.gridApi.applyTransaction({ update: [row] });
      return;
    }

    if (!row.originalAreaCode) {
      row.originalAreaCode = newValue;
    }

    row.AreaCode = newValue;
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  // Save row data to server (create or update)
  saveRow(row: AreaCodes): void {
    const isNew = !row.AreaCodeId;
    const trimmedCode = row.AreaCode?.trim() ?? '';
    const trimmedDesc = row.Description?.trim() ?? '';
    const isComplete = trimmedCode && trimmedDesc && row.Type && row.IsActive !== null;

    if (!isNew && !row.isEdited) {
      this.snackbarService.showInfo('No changes to save.');
      return;
    }

    row.AreaCode = trimmedCode;
    row.Description = trimmedDesc;

    if (isNew) {
      this.areaCodesService.addAreaCode(row).subscribe({
        next: () => {
          alert('Saved successfully!');
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });
          this.store.dispatch(new LoadAreaCodes());
        },
        error: (err) => {
          alert('Error saving area code.');
          console.error(err);
        },
      });
    } else {
      const { AreaCodeId, isEdited, originalAreaCode, isDeleted, ...sanitizedRow } = row;
      this.areaCodesService.updateAreaCode(AreaCodeId!, sanitizedRow).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Updated successfully!');
          row.isEdited = false;
          delete row.originalAreaCode;
          this.gridApi.applyTransaction({ update: [row] });
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  // Style new rows visually
  getRowClass = (params: any) => {
    return !params.data.AreaCodeId ? 'temporary-row' : '';
  };

  // Soft delete handler
  softDeleteProvider(areaCode: AreaCodes): void {
    const updatedAreaCode = { ...areaCode, isDeleted: true };
    this.store.dispatch(new SoftDeleteAreaCode(updatedAreaCode));
    this.snackbarService.showSuccess('Removed Successfully');
  }

  // Add new row locally
  addRow(): void {
    const newRow: AreaCodes = {
      AreaCode: '',
      Description: '',
      Type: 'Landline',
      IsActive: true,
    };
    this.store.dispatch(new AddAreaCodeRowLocally(newRow));
  }

  // Context menu for right-click actions
  getContextMenuItems: GetContextMenuItems = (params: GetContextMenuItemsParams) => {
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
