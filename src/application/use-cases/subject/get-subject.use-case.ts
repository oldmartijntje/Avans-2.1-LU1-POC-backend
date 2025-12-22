import { Inject, Injectable } from '@nestjs/common';
import type { ISubjectRepository } from '../../../domain/repositories/subject-repository.interface';
import { SUBJECT_REPOSITORY } from '../../../domain/repositories/subject-repository.interface';
import { Subject } from '../../../domain/entities/subject.entity';

@Injectable()
export class GetSubjectUseCase {
	constructor(
		@Inject(SUBJECT_REPOSITORY)
		private readonly subjectRepository: ISubjectRepository,
	) {}

	async execute(uuid: string): Promise<Subject> {
		return await this.subjectRepository.findById(uuid, true);
	}
}
