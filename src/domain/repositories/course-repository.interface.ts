import { Course } from '../entities/course.entity';

export interface ICourseRepository {
    findAll(): Promise<Course[]>;
    findById(uuid: string, populate: boolean): Promise<Course>;
    create(course: Course): Promise<Course>;
    update(uuid: string, data: Partial<Course>): Promise<Course>;
    delete(uuid: string): Promise<boolean>;
}

export const COURSE_REPOSITORY = Symbol('ICourseRepository');
