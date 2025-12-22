export class Subject {
	constructor(
		public readonly uuid: string,
		public titleId: string,
		public descriptionId: string,
		public ownerUuid: string,
		public level: 'NLQF-5' | 'NLQF-6',
		public studyPoints: number,
		public moreInfoId: string,
		public languages: string[],
		public tagIds: string[],
		public isFavourite?: boolean,
	) {}

	// Factory method
	static create(data: {
		uuid: string;
		titleId: string;
		descriptionId: string;
		ownerUuid: string;
		level: 'NLQF-5' | 'NLQF-6';
		studyPoints: number;
		moreInfoId: string;
		languages: string[];
		tagIds: string[];
		isFavourite?: boolean;
	}): Subject {
		return new Subject(
			data.uuid,
			data.titleId,
			data.descriptionId,
			data.ownerUuid,
			data.level,
			data.studyPoints,
			data.moreInfoId,
			data.languages,
			data.tagIds,
			data.isFavourite,
		);
	}
}
