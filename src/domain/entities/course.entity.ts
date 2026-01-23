export interface Translation {
    dutch: string;
    english: string;
}

export class Course {
    constructor(
        public readonly uuid: string,
        public title: Translation,
        public description: Translation,
        public languages: string[],
        public tags: string[],
    ) { }

    // Factory method
    static create(data: {
        uuid: string;
        title: Translation;
        description: Translation;
        languages: string[];
        tags: string[];
    }): Course {
        return new Course(
            data.uuid,
            data.title,
            data.description,
            data.languages,
            data.tags,
        );
    }
}
