export class LibraryCard
{
    constructor(
        public _id: string = "",
        public password: string = "",
        public issueDate: Date | null = null,
        public expirationDate: Date | null = null,
    ) { }

}
