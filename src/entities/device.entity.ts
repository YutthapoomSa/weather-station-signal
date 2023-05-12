import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({
    collection: 'device',
    // _id: true,
})
export class DeviceDB extends Document {
    @Prop({
        type: MongooseSchema.Types.String,
        required: false,
    })
    id_elkDV: string;

    @Prop({
        type: MongooseSchema.Types.String,
        unique: false,
        required: true,
    })
    serialNumber: string;

    @Prop({
        type: MongooseSchema.Types.String,
        required: true,
    })
    device_name: string;
}
export const DeviceSchema = SchemaFactory.createForClass(DeviceDB);
