export class Book
{
    constructor(
        public _id: string = '',
        public title: string = '',
        public category: string[] = [],
        public author: string[] = [],
        public publisher: string[] = [],
        public publishDate: string = '',
        public overview: string = '',
        public numberOfPages: number = 0,
        public images: string[] = [],
        public price: number = 0

    )
    {
        if (!images)
            images = ['https://dummyimage.com/400x600/dddddd/aaa&text=No+image'];
    }
}