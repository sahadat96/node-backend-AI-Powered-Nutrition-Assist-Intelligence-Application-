export class User {
    constructor(
        public readonly id:string,
        public email: string,
        public password: string,
        public role: string ="USER",
        public createdAt?: Date,
        public updatedAt?: Date, 
    ) {}
}