import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema()
export class Subject {
    @Prop()
    uuid: string;



    @Prop()
    ownerUuid: string;

    @Prop()
    level: 'NLQF-5' | 'NLQF-6';

    @Prop()
    studyPoints: number;


    @Prop({
        type: {
            dutch: { type: String, required: true },
            english: { type: String, required: true },
            _id: false
        },
        required: true,
        _id: false
    })
    title: { dutch: string; english: string };

    @Prop({
        type: {
            dutch: { type: String, required: true },
            english: { type: String, required: true },
            _id: false
        },
        required: true,
        _id: false
    })
    description: { dutch: string; english: string };

    @Prop({
        type: {
            dutch: { type: String, required: true },
            english: { type: String, required: true },
            _id: false
        },
        required: true,
        _id: false
    })
    moreInfo: { dutch: string; english: string };

    @Prop()
    languages: string[];

    @Prop()
    isFavourite?: boolean;

    @Prop({ type: [String] })
    tags: string[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
