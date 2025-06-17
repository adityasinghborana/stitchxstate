export class UserEntity {
    constructor(
        public readonly id:string,
        public firstName :string,
        public lastName :string,
        public email :string,
        public password :string | null, //password can be null if you intend  to only use Otp  for login post creation
        public createdAt :Date,
        public updatedAt :Date,
        public isAdmin:boolean,
        public phone?:string,
        public otp?:string | null, //store the current otp
        public otpExpiresAt?:Date | null
    ){}

    getFullName():string{
        return `${this.firstName} ${this.lastName}`
    }
}
