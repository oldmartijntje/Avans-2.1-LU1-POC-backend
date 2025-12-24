import { Course } from '../entities/course.entity';

export interface ICourseRepository {
    findAll(): Promise<any[]>; // Returns raw Mongoose documents
    findById(uuid: string, populate: boolean): Promise<any>; // Returns raw Mongoose document
    findAllDisplayTextReferences(): Promise<Array<{ title: string; description: string }>>;
    create(course: Course): Promise<any>; // Returns raw Mongoose document
    update(uuid: string, data: Partial<Course>): Promise<any>; // Returns raw Mongoose document
    delete(uuid: string): Promise<any>; // Returns {message: string}
}

export const COURSE_REPOSITORY = Symbol('ICourseRepository');
