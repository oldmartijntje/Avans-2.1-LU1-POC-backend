export class Course {
    constructor(
        public readonly uuid: string,
        public titleId: string,
        public descriptionId: string,
        public languages: string[],
        public tags: string[],
        // For test compatibility (optional hydrated fields)
        public title?: any,
        public description?: any,
    ) { }

    // Factory method
    static create(data: {
        uuid: string;
        titleId: string;
        descriptionId: string;
        languages: string[];
        tags: string[];
        title?: any;
        description?: any;
    }): Course {
        return new Course(
            data.uuid,
            data.titleId,
            data.descriptionId,
            data.languages,
            data.tags,
            data.title,
            data.description,
        );
    }
}
