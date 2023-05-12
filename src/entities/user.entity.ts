import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum UserDBRole {
    User = 'ผู้ใช้งาน',
    Admin = 'ผู้ดูแลระบบ',
}

export enum UserDBGender {
    MALE = 'ผู้ชาย',
    FEMALE = 'ผู้หญิง',
    OTHER = 'อื่นๆ',
}

export enum UserDBPrefix {
    Miss = 'นางสาว',
    Mrs = 'นาง',
    Mr = 'นาย',
}

// ────────────────────────────────────────────────────────────────────────────────

@Schema({
    collection: 'user',
    _id: true,
})
export class UserDB extends Document {
    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
        unique: true,
    })
    username: string;

    @Prop({
        type: MongooseSchema.Types.String,
        required: false,
    })
    password: string;

    @Prop({
        enum: Object.keys(UserDBPrefix).map((k) => UserDBPrefix[k]),
        required: true,
    })
    prefix: UserDBPrefix;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    firstName: string;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    lastName: string;

    @Prop({
        type: MongooseSchema.Types.String,
        required: false,
    })
    phoneNumber: string;

    @Prop({
        type: MongooseSchema.Types.String,
        required: false,
    })
    imageUser: string;

    @Prop({
        enum: Object.keys(UserDBGender).map((k) => UserDBGender[k]),
        required: true,
    })
    gender: UserDBGender;

    @Prop({
        enum: Object.keys(UserDBRole).map((k) => UserDBRole[k]),
    })
    role: UserDBRole;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDB);
