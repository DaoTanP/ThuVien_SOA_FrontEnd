export class LibraryCard
{
    constructor(
        public id: string = "",
        public password: string = "",
        public issueDate: string | null = null,
        public expirationDate: string | null = null,
    ) { }

}
