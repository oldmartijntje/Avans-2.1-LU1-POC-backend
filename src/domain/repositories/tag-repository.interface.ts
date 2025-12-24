import { Tag } from '../entities/tag.entity';

export const TAG_REPOSITORY = Symbol('ITagRepository');

export interface ITagRepository {
    findAll(): Promise<any[]>; // Returns raw Mongoose documents with _id and __v
    findById(id: string): Promise<Tag | null>;
    findByName(tagName: string): Promise<any | null>; // Returns raw Mongoose document
    create(tag: Omit<Tag, 'id'>): Promise<any>; // Returns raw Mongoose document
    delete(id: string): Promise<boolean>;
}
