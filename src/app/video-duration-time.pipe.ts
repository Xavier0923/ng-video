import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'videoDurationTime'
})
export class VideoDurationTimePipe implements PipeTransform {

  transform(value: number): string {
    if(value){
      let time = moment.duration(value, 'seconds')
      // 分
      let hour = String(time.hours()).length > 1 ? String(time.hours()) : '0' + String(time.hours());
      let minute = String(time.minutes()).length > 1 ? String(time.minutes()) : '0' + String(time.minutes());
      let second = String(time.seconds()).length > 1 ? String(time.seconds()) : '0' + String(time.seconds());
      console.log('hour', hour)
      console.log('minute', minute)
      console.log('second', second)
      return `${hour ? hour + ':' : ''}${minute ? minute + ':' : '00:'}${second}`
    }
    return null;
  }

}
