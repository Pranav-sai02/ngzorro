import { Component } from '@angular/core';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  // Selected file from input
  selectedFile: File | null = null;

  // Full list of uploaded files with metadata
  uploadedFiles: { file: File; uploadedAt: Date }[] = [];

  // Subset of files displayed in current page
  pagedFiles: { file: File; uploadedAt: Date }[] = [];

  // Pagination settings
  pageSize = 50;
  currentPage = 0;

  // Called when a file is selected via input
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Uploads the selected file and refreshes paginated view
  onUpload(): void {
    if (this.selectedFile) {
      this.uploadedFiles.push({
        file: this.selectedFile,
        uploadedAt: new Date(),
      });
      this.selectedFile = null;
      this.resetPagination();
    }
  }

  // Triggers browser print dialog
  printPage(): void {
    window.print();
  }

  // Downloads the selected file
  downloadFile(fileData: { file: File }): void {
    const file = fileData.file;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Resets pagination and updates displayed files
  resetPagination(): void {
    this.currentPage = 0;
    this.updatePagedFiles();
  }

  // Gets starting index of current page
  getStartIndex(): number {
    return this.currentPage * this.pageSize;
  }

  // Gets ending index of current page
  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.pageSize, this.uploadedFiles.length);
  }

  // Updates paged file list based on current page
  updatePagedFiles(): void {
    const start = this.getStartIndex();
    const end = this.getEndIndex();
    this.pagedFiles = this.uploadedFiles.slice(start, end);
  }

  // Navigate to previous page
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedFiles();
    }
  }

  // Navigate to next page
  nextPage(): void {
    if (this.getEndIndex() < this.uploadedFiles.length) {
      this.currentPage++;
      this.updatePagedFiles();
    }
  }

  // Initialize pagination on component load
  ngOnInit(): void {
    this.resetPagination();
  }
}
