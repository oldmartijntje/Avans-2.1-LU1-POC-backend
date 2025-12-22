export class Course {
    constructor(
        public readonly uuid: string,
        public titleId: string,
        public descriptionId: string,
        public languages: string[],
        public tagIds: string[],
    ) { }

    // Factory method
    static create(data: {
        uuid: string;
        titleId: string;
        descriptionId: string;
        languages: string[];
        tagIds: string[];
    }): Course {
        return new Course(
            data.uuid,
            data.titleId,
            data.descriptionId,
            data.languages,
            data.tagIds,
        );
    }
}
