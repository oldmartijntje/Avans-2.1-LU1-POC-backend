export class Tag {
    constructor(
        public readonly id: string,
        public readonly tagName: string
    ) { }

    static create(data: {
        id: string;
        tagName: string;
    }): Tag {
        return new Tag(
            data.id,
            data.tagName
        );
    }
}
