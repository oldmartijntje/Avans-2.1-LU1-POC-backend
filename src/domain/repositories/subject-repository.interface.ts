import { Subject } from '../entities/subject.entity';

export interface ISubjectRepository {
	findAll(filters?: {
		level?: 'NLQF-5' | 'NLQF-6';
		pointsFilter?: number;
		tagId?: string;
	}): Promise<Subject[]>;
	findById(uuid: string, populate: boolean): Promise<Subject>;
	create(subject: Subject): Promise<Subject>;
	update(uuid: string, data: Partial<Subject>): Promise<Subject>;
	delete(uuid: string): Promise<boolean>;
}

export const SUBJECT_REPOSITORY = Symbol('ISubjectRepository');
