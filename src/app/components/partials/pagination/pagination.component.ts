import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() itemsPerPage: number = 20;
  @Input() itemsPerPageOptions: number[] = [10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(): void {
    this.itemsPerPageChange.emit(this.itemsPerPage);
  }
}
