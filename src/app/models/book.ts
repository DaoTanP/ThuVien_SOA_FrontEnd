export class Book
{
    constructor(
        public id: string = '',
        public title: string = '',
        public category: string = '',
        public image: string = '',
        public author: string = '',
        public publisher: string = '',
        public publishDate: string | null = null,
        public overview: string = '',
        public numberOfPages: number = 0,
    )
    {
        if (!image || image === '')
            // this.image = 'https://dummyimage.com/400x600/dddddd/aaa&text=No+image';
            this.image = 'http://localhost:8080/images/book/' + image;
    }
}
