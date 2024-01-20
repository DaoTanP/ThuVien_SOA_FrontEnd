import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-book-grid',
  exportAs: 'book-grid',
  templateUrl: './book-grid.component.html',
  styleUrls: ['./book-grid.component.css']
})
export default class BookGridComponent implements OnInit
{
  @Input() row: number = 2;
  @Input() column: number = 6;
  @Input('data') books: Book[] = [];
  @Input() isCardHorizontal: boolean = false;
  @Input() currentPage: number = 1;

  @Output() onInit = new EventEmitter();
  @Output() onChangePage = new EventEmitter();

  current: number = this.currentPage || 1;

  public items = this.books;
  public itemsToDisplay: any[] = [];
  public perPage = this.row * this.column;
  public total = Math.ceil(this.items.length / this.perPage);
  public pages = this.getPages(this.current, this.total);

  constructor()
  {
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
  }

  ngOnInit ()
  {
    this.onInit.emit({ totalPages: this.total, currentPage: this.current, itemsPerPage: this.perPage, itemsOnDisplay: this.itemsToDisplay.length, totalItems: this.items.length });
  }

  ngOnChanges (changes: SimpleChanges): void
  {
    if (changes["books"] || changes["row"] || changes["column"])
    {
      // this.current = 1;
      this.recalculate();
    }

    // if (changes["row"] || changes["column"])
    // {
    // }

    if (changes["currentPage"])
    {
      // console.log("change current page: ", changes["currentPage"].previousValue, changes["currentPage"].currentValue);
      this.current = this.currentPage <= this.total ? this.currentPage : this.total;
      this.recalculate();
    }
  }

  public onGoTo (page: number): void
  {
    this.changePage(page);
  }
  public onNext (): void
  {
    this.changePage(this.current + 1);
  }
  public onPrevious (): void
  {
    this.changePage(this.current - 1);
  }
  public changePage (page: number): void
  {
    this.current = page;
    this.itemsToDisplay = this.paginate(this.current, this.perPage);
    this.pages = this.getPages(this.current, this.total);
    this.onChangePage.emit({ totalPages: this.total, currentPage: this.current, itemsPerPage: this.perPage, itemsOnDisplay: this.itemsToDisplay.length, totalItems: this.items.length });
    // console.log({ totalPages: this.total, currentPage: this.current, itemsPerPage: this.perPage, itemsOnDisplay: this.itemsToDisplay.length, totalItems: this.items.length });
  }
  private getPages (current: number, total: number): number[]
  {
    if (total <= 5)
    {
      return Array.from({ length: total }, (e, i) => i + 1)
    }

    // -1 means other page numbers in between are abreviated
    if (current > 3 && current <= total - 3)
    {
      return [1, -1, current - 1, current, current + 1, -1, total]
    }

    if (current > total - 3)
    {
      return [1, -1, total - 3, total - 2, total - 1, total]
    }

    return [1, 2, 3, 4, -1, total]
  }

  public paginate (current: number, perPage: number): any[]
  {
    return [...this.items.slice((current - 1) * perPage).slice(0, perPage)]
  }

  public recalculate ()
  {
    this.items = this.books
    this.perPage = this.row * this.column
    this.total = Math.ceil(this.items.length / this.perPage)
    this.pages = this.getPages(this.current, this.total)
    this.itemsToDisplay = this.paginate(this.current, this.perPage)
  }
}

