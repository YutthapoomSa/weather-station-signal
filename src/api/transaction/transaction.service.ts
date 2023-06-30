import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import mongoose, { Model } from 'mongoose';
import { DeviceDB } from 'src/entities/device.entity';
import { TransactionDB } from './../../entities/transaction.entity';
import { LogService } from './../../services/log.service';
import { ResStatus } from './../../share/enum/res-status.enum';
import { CreateTransactionDto } from './dto/create-transaction.dto';
const moment = require('moment-timezone');
// moment.tz.setDefault('Asia/Bangkok');
moment.tz.setDefault('Asia/Bangkok');

// ────────────────────────────────────────────────────────────────────────────────

// const lineNotify = require('line-notify-nodejs')('DLwHWm8xXmJukvnH9ZG3kwuNkxy8omRy1eyn21fVvT4');
const url = 'https://elastic.whsse.net/ws-signal/_doc/';
// const url2 = 'https://elastic.whsse.net/weather-station-Omega/_doc/';
const username = 'elastic';
const password = '0123456789';
const auth = {
    username: username,
    password: password,
};

// ────────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
    private logger = new LogService(TransactionService.name);

    constructor(
        @InjectModel(TransactionDB.name)
        private readonly transactionModel: Model<TransactionDB>,
        @InjectModel(DeviceDB.name)
        private readonly deviceModel: Model<DeviceDB>,
    ) { }
    async onApplicationBootstrap() {
        //
    }
    async create(createTransactionDto: CreateTransactionDto) {
        const tag = this.create.name;
        try {
            if (!createTransactionDto) throw new Error('Transaction is required !!');
            console.log('createTransactionDto', JSON.stringify(createTransactionDto, null, 2));

            const id_elk = createTransactionDto.serial_number
                ? String(createTransactionDto.serial_number + moment().format('YYYYMMDDHHmmss'))
                : moment().format('YYYYMMDDHHmmss');
            console.log('id_elk ->', JSON.stringify(id_elk, null, 2));

            // const id_elk2 = createTransactionDto.temperature
            //     ? String(createTransactionDto.temperature + moment().format('YYYYMMDDHHmmss'))
            //     : moment().format('YYYYMMDDHHmmss');

            const transactions = new this.transactionModel();
            transactions.serial_number = createTransactionDto.serial_number ? createTransactionDto.serial_number : null;
            transactions.id_elk = id_elk;
            transactions.humidity = createTransactionDto.humidity ? createTransactionDto.humidity : null;
            transactions.temperature = createTransactionDto.temperature ? createTransactionDto.temperature : null;
            transactions.heat_index = createTransactionDto.heat_index ? createTransactionDto.heat_index : null;
            transactions.flag = createTransactionDto.flag ? createTransactionDto.flag : null;

            const resultNoti = await transactions.save();
            // await transactions.save();
            console.log('transactions =:} ', JSON.stringify(transactions, null, 2));

            // ─────────────────────────────────────────────────────────────────────────────

            const transactionEa = transactions;

            // ─────────────────────────────────────────────────────────────────────────────

            const reNewTransactionEa = {
                serial_number: transactionEa.serial_number ? transactionEa.serial_number : null,
                humidity: transactionEa.humidity ? transactionEa.humidity : null,
                temperature: transactionEa.temperature ? transactionEa.temperature : null,
                heat_index: transactionEa.heat_index ? transactionEa.heat_index : null,
                flag: transactionEa.flag ? transactionEa.flag : null,
                date_data: moment().tz("Asia/Bangkok").format(),
                // deviceList: transactionEa.deviceList
            };
            console.log('reNewTransactionEa =:} ', JSON.stringify(reNewTransactionEa, null, 2));

            //Axios Create──────────────────────────────────────────────────────────────────
            await axios
                .put(url + id_elk, reNewTransactionEa, { auth })
                .then((results) => {
                    console.log('Result =:} ', JSON.stringify(results.data, null, 2));
                })
                .catch((error) => {
                    console.log('Failed to fetch -> ', error);
                });

            //Axios Update──────────────────────────────────────────────────────────────────
            // await axios
            //     .put(url2 + id_elk2, reNewTransactionEa, { auth })
            //     .then((results) => {
            //         console.log('Result =:} ', JSON.stringify(results.data, null, 2));
            //     })
            //     .catch((error) => {
            //         console.log('Failed to fetch -> ', error);
            //     });

            if (!resultNoti) throw new Error('something went wrong try again later');
            // await this.lineNotifySend(createTransactionDto);

            return ResStatus.success, 'Success', resultNoti;
        } catch (err) {
            console.error(`${tag} -> `, err);
            this.logger.error(`${tag} -> `, err);
            throw new HttpException(`${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
