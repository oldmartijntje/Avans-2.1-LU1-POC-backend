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
        public tags: string[],
        public isFavourite?: boolean,
        // For test compatibility (optional hydrated fields)
        public title?: any,
        public description?: any,
        public moreInfo?: any,
    ) { }

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
        tags: string[];
        isFavourite?: boolean;
        title?: any;
        description?: any;
        moreInfo?: any;
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
            data.tags,
            data.isFavourite,
            data.title,
            data.description,
            data.moreInfo,
        );
    }
}
