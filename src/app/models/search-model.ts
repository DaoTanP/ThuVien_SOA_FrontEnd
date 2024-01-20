export class SearchModel
{
    [key: string]: any;

    constructor(public bookTitle: string | null = null,
        public category: string[] | null = [],
        public author: string | null = null,
        public publisher: string | null = null,
        public publishedFrom: string | null = null,
        public publishedTo: string | null = null) { }
}
