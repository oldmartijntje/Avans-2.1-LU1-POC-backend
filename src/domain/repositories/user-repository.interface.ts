import { User } from '../entities/user.entity';

export interface IUserRepository {
    findAll(role?: string): Promise<User[]>;
    findById(uuid: string): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByUsernameForAuth(username: string): Promise<User | null>;
    create(user: User, password: string): Promise<User>;
    update(uuid: string, data: Partial<User>): Promise<User>;
    delete(uuid: string): Promise<boolean>;
    existsByUsername(username: string): Promise<boolean>;
    existsByEmail(email: string): Promise<boolean>;
    addFavourite(uuid: string, subjectId: string): Promise<any>; // Returns Mongoose document
    removeFavourite(uuid: string, subjectId: string): Promise<any>; // Returns Mongoose document
    getFavouriteIds(uuid: string): Promise<string[]>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
