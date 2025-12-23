export enum UserRole {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT'
}

export class User {
    constructor(
        public readonly uuid: string,
        public readonly username: string,
        public email: string,
        public role: UserRole,
        public studyId?: string | null,
        public favouriteIds?: string[],
        private _password?: string
    ) { }

    // Business logic methods
    hasPassword(): boolean {
        return !!this._password;
    }

    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }

    isTeacher(): boolean {
        return this.role === UserRole.TEACHER;
    }

    isStudent(): boolean {
        return this.role === UserRole.STUDENT;
    }

    canManageUsers(): boolean {
        return this.isAdmin() || this.isTeacher();
    }

    // Factory method
    static create(data: {
        uuid: string;
        username: string;
        email: string;
        role: UserRole;
        studyId?: string | null;
        favouriteIds?: string[];
        password?: string;
    }): User {
        return new User(
            data.uuid,
            data.username,
            data.email,
            data.role,
            data.studyId,
            data.favouriteIds || [],
            data.password
        );
    }
}
