import e from 'express';
import * as moment from 'moment';
const parser = require('cron-parser');

export const formatData = (
    data: any[],
    currentDate: string,
    endDate: string,
    unit: any,
) => {
    if (data.length == 0) return [];

    let map = {};
    data.forEach((item) => {
        const key =
            item._id.year +
            '-' +
            (item._id.month < 10 ? '0' + item._id.month : item._id.month) +
            '-' +
            (item._id.day < 10 ? '0' + item._id.day : item._id.day) +
            ' ' +
            (item._id.hour < 10 ? '0' + item._id.hour : item._id.hour) +
            ':' +
            (item._id.minute < 10 ? '0' + item._id.minute : item._id.minute);
        map[key] = item.count;
    });



    
    const list = [];
    if (unit == 'd') {
        console.log(data)
        data.forEach(item=>{
            map[item._id] = item.count
        })
        const options = {
            currentDate: moment(new Date(currentDate)).toDate(),
            endDate: moment(new Date(endDate)).toDate(),
            //   iterator: true,
        };
        let cur = options.currentDate;
        while (cur < options.endDate) {
            const endStr = moment(cur).format('YYYY-MM-DD');
            cur = moment(cur).add(1, 'day').toDate();
    
            if (map[endStr]) {
                list.push({
                    time: endStr,
                    total: map[endStr],
                });
            } else {
                // 没有数据补0
                list.push({
                    time: endStr,
                    total: 0,
                });
            }
        }
    } else {
        const options = {
            currentDate: moment(new Date(currentDate)).toDate(),
            endDate: moment(new Date(endDate)).add(unit, 'minute').toDate(),
            //   iterator: true,
        };
        let cur = options.currentDate;
        while (cur < options.endDate) {
            const endStr = moment(cur).format('YYYY-MM-DD HH:mm');
            cur = moment(cur).add(unit, 'minute').toDate();
    
            if (map[endStr]) {
                list.push({
                    time: endStr,
                    total: map[endStr],
                });
            } else {
                // 没有数据补0
                list.push({
                    time: endStr,
                    total: 0,
                });
            }
        }
    }

    // const interval = parser.parseExpression('0 */' + unit + ' * * * *', options);

    // while (true) { // eslint-disable-line
    //   try {

    //     const end = moment(interval.next().value._date.ts);

    //     const endStr = end.format('YYYY-MM-DD HH:mm')

    //     // console.log(endStr,interval.next().value.toString(),new Date(interval.next().value.toString()));
    //     // console.log(endStr)

    //     if (map[endStr]) {

    //       list.push({
    //         time: endStr,
    //         total: map[endStr]
    //       })
    //     } else {
    //       list.push({
    //         time: endStr,
    //         total: 0
    //       })
    //     }

    //   } catch (e) {
    //     // console.log(e)
    //     break;
    //   }
    // }
    return list;
};
export const formatSpeedData = (
    data: any[],
    currentDate: string,
    endDate: string,
    unit: number,
) => {
    if (data.length == 0) return [];

    const map = {};
    data.forEach((item) => {
        const key =
            item._id.year +
            '-' +
            (item._id.month < 10 ? '0' + item._id.month : item._id.month) +
            '-' +
            (item._id.day < 10 ? '0' + item._id.day : item._id.day) +
            ' ' +
            (item._id.hour < 10 ? '0' + item._id.hour : item._id.hour) +
            ':' +
            (item._id.minute < 10 ? '0' + item._id.minute : item._id.minute);
        map[key] = parseInt(item.avg_value);
    });

    const options = {
        currentDate: moment(new Date(currentDate)).toDate(),
        endDate: moment(new Date(endDate)).add(unit, 'minute').toDate(),
        //   iterator: true,
    };

    let cur = options.currentDate;
    const list = [];
    while (cur < options.endDate) {
        const endStr = moment(cur).format('YYYY-MM-DD HH:mm');
        cur = moment(cur).add(unit, 'minute').toDate();

        if (map[endStr]) {
            list.push({
                time: endStr,
                total: map[endStr],
            });
        } else {
            // 没有数据补0
            list.push({
                time: endStr,
                total: 0,
            });
        }
    }

    return list;
};
