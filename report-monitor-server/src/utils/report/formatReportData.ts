import * as moment from 'moment'
const parser = require('cron-parser');

export const formatData = (data: any[], currentDate: string, endDate: string, unit: number) => {
    if (data.length == 0) return []

    let map = {}
    data.forEach(item => {
        let key = item._id.year + '-' +
            (item._id.month < 10 ? '0' + item._id.month : item._id.month) + '-' +
            (item._id.day < 10 ? '0' + item._id.day : item._id.day) + ' ' +
            (item._id.hour < 10 ? '0' + item._id.hour : item._id.hour) + ':' +
            (item._id.minute < 10 ? '0' + item._id.minute : item._id.minute)
        map[key] = item.count
    })


    const options = {
        currentDate: moment(new Date(currentDate)).toDate(),
        endDate: moment(new Date(endDate)).add(unit, 'minute').toDate(),
        //   iterator: true,
    };

    var cur = options.currentDate
    var list = []
    while (cur < options.endDate) {
        const endStr = moment(cur).format('YYYY-MM-DD HH:mm')
        cur = moment(cur).add(unit, 'minute').toDate()

        if (map[endStr]) {
            list.push({
                time: endStr,
                total: map[endStr]
            })
        } else { // 没有数据补0
            list.push({
                time: endStr,
                total: 0
            })
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
    return list
}
