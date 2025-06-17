import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ag-grid-wrapper',
  templateUrl: './ag-grid-wrapper.component.html',
  standalone: false,
})
export class AgGridWrapperComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: any[] = [];
  @Input() defaultColDef: any = {};
  @Input() pagination = true;
  @Input() paginationPageSize = 20;
  @Input() rowClassRules: any = {};
  @Input() getRowClass: any;
  @Input() components: any = {};
  @Input() getContextMenuItems: any;

  @Output() cellValueChanged = new EventEmitter<any>();

  onCellValueChanged(event: any) {
    this.cellValueChanged.emit(event);
  }
}