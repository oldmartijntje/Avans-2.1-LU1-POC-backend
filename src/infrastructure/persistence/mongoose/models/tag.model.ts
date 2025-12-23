import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
    _id: Types.ObjectId;

    @Prop({ required: true })
    tagName: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
