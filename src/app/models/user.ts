const defaultAvatarImageUrl = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export class User
{
    constructor(
        public _id: string = "",
        public username: string = "",
        public password: string = "",
        public displayName: string = "",
        public dateOfBirth: string | null = null,
        public dob: Date | null = null,
        public gender: boolean | null = null,
        public address: string | null = null,
        public email: string | null = null,
        public phoneNumber: string | null = null,
        public avatar: string | null = null,
        public favorite: string[] = [],
        public cardId: String | null = null,
    )
    {
        if (dateOfBirth)
            dob = new Date(dateOfBirth);

        if (!avatar)
            avatar = defaultAvatarImageUrl;
    }


    public set value (v: User)
    {
        this._id = v._id;
        this.username = v.username;
        this.password = v.password;
        this.displayName = v.displayName;
        this.dateOfBirth = v.dateOfBirth;
        if (v.dateOfBirth)
            this.dob = new Date(v.dateOfBirth);
        this.gender = v.gender;
        this.address = v.address;
        this.email = v.email;
        this.phoneNumber = v.phoneNumber;
        this.avatar = v.avatar;
        this.favorite = v.favorite;
        this.cardId = v.cardId;
    }

}