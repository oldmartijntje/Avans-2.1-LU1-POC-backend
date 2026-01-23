import { Translation } from './course.entity';

export class Subject {
    constructor(
        public readonly uuid: string,
        public title: Translation,
        public description: Translation,
        public ownerUuid: string,
        public level: 'NLQF-5' | 'NLQF-6',
        public studyPoints: number,
        public moreInfo: Translation,
        public languages: string[],
        public tags: string[],
        public isFavourite?: boolean,
        public _id?: any,
        public __v?: number,
    ) { }

    // Factory method
    static create(data: {
        uuid: string;
        title: Translation;
        description: Translation;
        ownerUuid: string;
        level: 'NLQF-5' | 'NLQF-6';
        studyPoints: number;
        moreInfo: Translation;
        languages: string[];
        tags: string[];
        isFavourite?: boolean;
        _id?: any;
        __v?: number;
    }): Subject {
        return new Subject(
            data.uuid,
            data.title,
            data.description,
            data.ownerUuid,
            data.level,
            data.studyPoints,
            data.moreInfo,
            data.languages,
            data.tags,
            data.isFavourite,
            data._id,
            data.__v,
        );
    }
}
