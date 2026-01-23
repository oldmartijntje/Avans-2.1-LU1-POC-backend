import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
    @Prop()
    uuid: string;


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

    @Prop()
    languages: string[];

    @Prop({ type: [String] })
    tags: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
