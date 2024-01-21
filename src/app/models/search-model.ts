export class SearchModel
{
    [key: string]: any;

    constructor(public title: string | null = null,
        public category: string[] | null = [],
        public author: string[] | string | null = null,
        public publisher: string[] | string | null = null,
        public publishedFrom: string | null = null,
        public publishedTo: string | null = null) { }
}