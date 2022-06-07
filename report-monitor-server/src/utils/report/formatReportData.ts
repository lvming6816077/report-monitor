import * as moment from 'moment'
const parser = require('cron-parser');

export const formatData = (data: any[], currentDate: string, endDate: string,unit:number)=> {
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
      currentDate: moment(new Date(currentDate)).subtract(unit, 'minute').toDate(),
      endDate: moment(new Date(endDate)).add(unit, 'minute').toDate(),
      iterator: true,
    };
    const interval = parser.parseExpression('0 */' + unit + ' * * * *', options);
    var list = []
    while (true) { // eslint-disable-line
      try {
        const end = moment(new Date(interval.next().value.toString()));

        const endStr = end.format('YYYY-MM-DD HH:mm')
        if (map[endStr]) {

          list.push({
            time: endStr,
            total: map[endStr]
          })
        } else {
          list.push({
            time: endStr,
            total: 0
          })
        }

      } catch (e) {
        // console.log(e)
        break;
      }
    }
    return list
  }
