import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DisplayTextDocument = HydratedDocument<DisplayText>;

@Schema()
export class DisplayText {
    _id: Types.ObjectId;

    @Prop({ required: true })
    dutch: string;

    @Prop({ required: true })
    english: string;

    @Prop({ required: true })
    creatorUuid: string;

    @Prop({ unique: true, sparse: true })
    uiKey?: string;
}

export const DisplayTextSchema = SchemaFactory.createForClass(DisplayText);
