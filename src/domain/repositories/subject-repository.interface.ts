import { Subject } from '../entities/subject.entity';

export interface ISubjectRepository {
    findAll(filters?: {
        level?: 'NLQF-5' | 'NLQF-6';
        pointsFilter?: number;
        tagId?: string;
    }): Promise<any[]>; // Returns raw Mongoose documents
    findById(uuid: string, populate: boolean): Promise<any>; // Returns raw Mongoose document
    create(subject: Subject): Promise<any>; // Returns raw Mongoose document
    update(uuid: string, data: Partial<Subject>): Promise<any>; // Returns raw Mongoose document
    delete(uuid: string): Promise<any>; // Returns {message: string}
}

export const SUBJECT_REPOSITORY = Symbol('ISubjectRepository');
