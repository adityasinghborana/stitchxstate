export class UserEntity {
    constructor(
        public readonly id:string,
        public firstName :string,
        public lastName :string,
        public email :string,
        public password :string,
        public createdAt :Date,
        public updatedAt :Date,
        public isAdmin:boolean,
        public phone?:string
    ){}

    getFullName():string{
        return `${this.firstName} ${this.lastName}`
    }
}