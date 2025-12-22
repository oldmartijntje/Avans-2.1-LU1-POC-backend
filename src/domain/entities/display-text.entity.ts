export class DisplayText {
    constructor(
        public readonly id: string,
        public readonly dutch: string,
        public readonly english: string,
        public readonly creatorUuid: string,
        public readonly uiKey?: string
    ) { }

    static create(data: {
        id: string;
        dutch: string;
        english: string;
        creatorUuid: string;
        uiKey?: string;
    }): DisplayText {
        return new DisplayText(
            data.id,
            data.dutch,
            data.english,
            data.creatorUuid,
            data.uiKey
        );
    }
}
