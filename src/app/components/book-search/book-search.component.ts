import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/models/book';
import { SearchModel } from 'src/app/models/search-model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent
{
  protected searchModel: SearchModel = new SearchModel();
  protected displayStyleHorizontal: boolean = false;
  protected pageNumber: number | undefined = undefined;
  protected categories: Observable<any[]> = of([]);

  bookListAsync: Observable<Book[]> = of([]);
  protected bookList: Book[] = [];
  protected firstItemOnPage: number = 0;
  protected lastItemOnPage: number = 0;
  protected totalItems: number = 0;
  protected itemsPerPage: number = 0;

  protected searchForm: FormGroup = new FormGroup({
    bookTitle: new FormControl(null),
    categories: new FormArray([]),
    author: new FormControl(null),
    publisher: new FormControl(null),
    publishedFrom: new FormControl(null),
    publishedTo: new FormControl(null),
  });

  protected sortForm: FormGroup = new FormGroup({
    sortBy: new FormControl(null),
    sortAscending: new FormControl(true),
  });

  constructor(private httpService: HttpService, private router: Router, private route: ActivatedRoute)
  {
    this.categories = httpService.getCategories();

    // this.route.queryParams
    this.route.queryParamMap.subscribe(params =>
    {
      this.pageNumber = Number.parseInt(params.get('page') || '');
      this.displayStyleHorizontal = params.get('displayStyle') === 'horizontal' ? true : false;
      this.sortForm.setValue({ sortBy: params.get('sortBy') || 'title', sortAscending: params.get('sortOrder') === 'asc' ? true : false });

      let hasParams = false;
      let changed = false;
      hasParams = Object.keys(params).some(param => (param !== 'page' && param !== 'sortBy' && param !== 'sortOrder' && param !== 'displayStyle'));
      if (!hasParams)
      {
        this.bookListAsync = this.httpService.getBooks();
        this.getList(this.sortForm.value.sortBy, this.sortForm.value.sortAscending);
        return;
      }

      const sm = new SearchModel(params.get('title'), params.getAll('category'), params.get('author'), params.get('publisher'), params.get('publishedFrom'), params.get('publishedTo'));
      for (const key in sm)
      {
        if (this.searchModel[key] !== sm[key])
        {
          this.searchModel[key] = sm[key];
          changed = true;
        }
      }

      if (changed)
      {
        this.bookListAsync = this.httpService.searchBooks(this.searchModel);
        this.getList(this.sortForm.value.sortBy, this.sortForm.value.sortAscending);
      }

      const selectedCategories = (this.searchForm.get('categories') as FormArray);
      const paramCategories = params.getAll('category');

      paramCategories.forEach(c => (c && selectedCategories.value.indexOf(c) < 0) ? selectedCategories.push(new FormControl(c)) : undefined);

    });

    const { category, ...formValue } = this.searchModel;
    this.searchForm.patchValue(formValue);
  }

  getList (sortBy: string = '', sortAscending: boolean = false)
  {
    this.bookListAsync.subscribe(books =>
    {
      const data = books.map((book: any) => new Book(book.id, book.title, book.category.name, book.image, book.author.name, book.publisher.name, book.publishDate, book.overview, book.numberOfPages));
      this.bookList = this.sortData(data, sortBy, sortAscending);

      this.totalItems = books.length;
      this.resetPaginationInfo();
    });
  }

  reset ()
  {
    const queryParams = {
      title: null,
      category: null,
      author: null,
      publisher: null,
      publishedFrom: null,
      publishedTo: null,
      page: 1,
    }
    const selectedCategories = (this.searchForm.get('categories') as FormArray);
    selectedCategories.clear();
    this.router.navigate(['/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
  }

  search ()
  {
    let query = this.searchForm.value;

    // console.log(query.categories);

    const queryParams = {
      title: query.bookTitle,
      category: query.categories,
      author: query.author,
      publisher: query.publisher,
      publishedFrom: query.publishedFrom,
      publishedTo: query.publishedTo,
      page: 1,
    }

    this.router.navigate(['/search'], { queryParams: queryParams, queryParamsHandling: 'merge' });
  }

  changeDisplayStyle ()
  {
    this.router.navigate(['/search'], { queryParams: { displayStyle: this.displayStyleHorizontal ? 'vertical' : 'horizontal' }, queryParamsHandling: 'merge' });
  }

  sort (by: string, ascending: boolean = false)
  {
    this.router.navigate(['/search'], { queryParams: { sortBy: by, sortOrder: ascending ? 'asc' : 'desc' }, queryParamsHandling: 'merge' });
  }

  sortData (bookList: Book[], by: string, ascending: boolean = false)
  {
    switch (by)
    {
      case 'title':
        if (ascending)
          return bookList.sort((a, b) => a.title.localeCompare(b.title));
        else
          return bookList.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'publishedDate':
        if (ascending)
          return bookList.sort((a, b) =>
          {
            if (!a.publishDate || !b.publishDate) return 1;
            const d1 = a.publishDate.split('/').reverse().join('');
            const d2 = b.publishDate.split('/').reverse().join('');
            return d1.localeCompare(d2);
          });
        else
          return bookList.sort((a, b) =>
          {
            if (!a.publishDate || !b.publishDate) return 1;
            const d1 = a.publishDate.split('/').reverse().join('');
            const d2 = b.publishDate.split('/').reverse().join('');
            return d2.localeCompare(d1);
          });
        break;

      default:
        return bookList;
        break;
    }
  }

  onCategoryCheckboxChange (event: any)
  {
    const selectedCategories = (this.searchForm.get('categories') as FormArray);
    if (event.target.checked)
    {
      selectedCategories.push(new FormControl(event.target.value));
    } else
    {
      const index = selectedCategories.controls.findIndex(x => x.value === event.target.value);
      selectedCategories.removeAt(index);
    }
  }

  onChangePage (e: any)
  {
    this.router.navigate(['/search'], { queryParams: { page: e.currentPage }, queryParamsHandling: 'merge' });
  }

  getPaginationInfo (e: any)
  {
    if (e.currentPage > e.totalPages)
      e.currentPage = e.totalPages;
    this.firstItemOnPage = (e.currentPage - 1) * e.itemsPerPage + 1;
    this.itemsPerPage = e.itemsPerPage;
    this.lastItemOnPage = e.currentPage * this.itemsPerPage;
    this.totalItems = e.totalItems;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems;

    if (this.pageNumber && this.pageNumber > e.totalPages)
    {
      this.pageNumber = e.totalPages;
      this.router.navigate(['/search'], { queryParams: { page: this.pageNumber }, queryParamsHandling: 'merge' })
    }
  }

  resetPaginationInfo ()
  {
    this.firstItemOnPage = 1
    this.lastItemOnPage = this.itemsPerPage;
    if (this.lastItemOnPage > this.totalItems)
      this.lastItemOnPage = this.totalItems
  }
}
