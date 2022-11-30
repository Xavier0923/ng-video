import { UploadImageService } from './../upload-image.service';
import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'

interface VideoFragments {
  url: string;
  fragments: Fragments[];
}

interface Fragments {
  imgName: string;
  currentTime: string;
  secondsTime: number;
  remark: string;
  imgUrl?: string;
}

@Component({
  selector: 'app-custom-video-player',
  templateUrl: './custom-video-player.component.html',
  styleUrls: ['./custom-video-player.component.scss']
})
export class CustomVideoPlayerComponent implements OnInit {

  // 屬性
  isPlay = false;
  volume = 50;
  showSetting = false;
  videoSpeed = 1;
  isMuted = false;
  isFullScreen = false;
  isError = false;
  isLoading = false;

  // 文字顯示時間
  totalTime = ''
  currentTime = '0:00';
  // 數字顯示時間
  durationTime = 0;
  progressTime = 0;

  // 擷取屬性
  canvas!: HTMLCanvasElement;
  base64Url = '';
  imageIndex = 0;
  file: File;

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('videoWindow') videoWindow: ElementRef;
  @ViewChild('speedSetting') speedSetting: ElementRef;
  @ViewChild('videoProgress') videoProgress: ElementRef;

  // api 來的
  videoFragments: VideoFragments;

  // 修改
  editVideoFragments: Fragments[];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // 事件
    //onloadeddata
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadeddata', () => {
      console.log('loadeddata')
      // 給進度調時間使用
      this.durationTime = this.videoPlayer.nativeElement.duration;
      this.progressTime = 0;
      // 顯示總時間、當前時間
      this.totalTime = moment.duration(this.videoPlayer.nativeElement.duration, 'seconds').format({ trim: false })
      this.currentTime = '0:00';
    })
    //timeupdate
    this.renderer.listen(this.videoPlayer.nativeElement, 'timeupdate', () => {
      console.log('timeupdate')
      this.progressTime = this.videoPlayer.nativeElement.currentTime;
      this.currentTime = this.videoPlayer.nativeElement.currentTime < 1 ? '0:00' : moment.duration(this.videoPlayer.nativeElement.currentTime, 'seconds').format({ trunc: true })
      // 預載寫入畫布
      this.canvas = this.renderer.createElement('canvas');
      this.canvas.width = 1600;
      this.canvas.height = 900;
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, 1600, 900);
      this.base64Url = this.canvas.toDataURL()

    })
    //waiting
    this.renderer.listen(this.videoPlayer.nativeElement, 'waiting', () => {
      console.log('waiting')
      // 處理緩衝
    })

    // 針對不同瀏覽器監聽全螢幕狀態
    this.renderer.listen(this.videoWindow.nativeElement, 'fullscreenchange', () => {
      this.isFullScreen = !this.isFullScreen;
    })
    this.renderer.listen(this.videoWindow.nativeElement, 'webkitfullscreenchange', () => {
      this.isFullScreen = !this.isFullScreen;
    })
    this.renderer.listen(this.videoWindow.nativeElement, 'mozfullscreenchange', () => {
      this.isFullScreen = !this.isFullScreen;
    })
    this.renderer.listen(this.videoWindow.nativeElement, 'msfullscreenchange', () => {
      this.isFullScreen = !this.isFullScreen;
    })
    this.renderer.listen(this.videoWindow.nativeElement, 'exitFullscreen', () => {
      this.isFullScreen = !this.isFullScreen;
    })
  }

  // 取資料
  //getData
  getData() {
    // api
    const data = '{"url":"assets/20220901/","fragments":[{"imgName":"202209010001_00001700.png","currentTime":"00:00:17.000","secondsTime":17,"remark":"asd"},{"imgName":"202209010001_00014700.png","currentTime":"00:01:47.455","secondsTime":107.455498,"remark":"zxc"},{"imgName":"202209010001_00025400.png","currentTime":"00:02:54.000","secondsTime":174,"remark":"zxc"},{"imgName":"202209010001_00025400.png","currentTime":"00:01:40.950","secondsTime":100.950533,"remark":"zxc"}]}'
    this.videoFragments = JSON.parse(data);
    // 維護
    this.editVideoFragments = this.videoFragments.fragments.map((fg) => {
      fg.imgUrl = this.videoFragments.url + fg.imgName;
      return fg;
    })
    console.log(this.editVideoFragments)
  }

  // 控制方法
  // 播放/暫停
  playVideo() {
    if (!this.isPlay) {
      this.videoPlayer.nativeElement.play()
    } else {
      this.videoPlayer.nativeElement.pause()
    }
    this.isPlay = !this.isPlay
  }

  // 快轉\倒退
  videoSkip(value: number) {
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', this.videoPlayer.nativeElement.currentTime + value);
  }

  // 靜音開關
  volumeMuted() {
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'muted', !this.videoPlayer.nativeElement.muted)
    this.isMuted = !this.isMuted;
    // 需要將音量轉至0
    this.volume = this.isMuted ? 0 : 50;
  }

  // 音量
  volumeControl(event: any) {
    this.volume = event.target.value
    if (this.volume > 0) {
      this.renderer.setProperty(this.videoPlayer.nativeElement, 'muted', false)
      this.isMuted = false;
    } else {
      this.renderer.setProperty(this.videoPlayer.nativeElement, 'muted', true)
      this.isMuted = true;
    }
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'volume', this.volume / 100)
  }

  // 時間軸
  timeControl(event: any) {
    console.log(event.target.value)
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', event.target.value)
  }

  // 調整速度
  speedControl(value: number) {
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'playbackRate', value)
    this.openSpeedSetting()
  }

  // 速度清單
  openSpeedSetting() {
    this.showSetting = !this.showSetting;
    this.renderer.setStyle(this.speedSetting.nativeElement, 'visibility', (this.showSetting ? 'visible' : 'hidden'))
  }

  // 全螢幕
  fullScreen() {
    if (this.isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (this.videoWindow.nativeElement.webkitRequestFullscreen) {
        console.log('use webkitRequestFullscreen')
        this.videoWindow.nativeElement.webkitRequestFullscreen()
      } else if (this.videoWindow.nativeElement.requestFullscreen) {
        console.log('use requestFullscreen')
        this.videoWindow.nativeElement.requestFullscreen()
      } else if (this.videoWindow.nativeElement.msRequestFullscreen) {
        console.log('use msRequestFullscreen')
        this.videoWindow.nativeElement.msRequestFullscreen()
      }
      console.log(this.isFullScreen)
    }
  }

  // 擷取片段
  captureFragment() {
    console.log(this.base64Url);
    this.file = this.base64toFile();
    console.log(this.file)
    this.editVideoFragments.push({
      imgName: this.file.name,
      currentTime: moment.duration(this.videoPlayer.nativeElement.currentTime, 'seconds').format('hh:mm:ss.SSS', { trim: false }),
      secondsTime: this.progressTime,
      remark: '',
      imgUrl: this.base64Url
    })
    this.editVideoFragments.sort((a, b) => { return a.secondsTime - b.secondsTime })
  }

  // 轉檔
  base64toFile() {
    // 分割数据
    const [meta, data] = this.base64Url.split(',')
    // 对数据编码
    let byte
    if (meta.includes('base64')) {
        byte = atob(data)
    } else {
        byte = encodeURI(data)
    }
    // 获取图片格式
    const mime = meta.split(':')[1].split(';')[0]
    // 创建 8 位无符号整型数组
    const ia = new Uint8Array(byte.length)
    // 获取字符 UTF-16 编码值
    for (let i = 0; i < byte.length; i++) {
        ia[i] = Number(byte.codePointAt(i))
    }
    const index = String(this.imageIndex + 1).padStart(4, '0')

    console.log(index)
    // 生成文件对象
    return new File([ia], `${moment().format('YYYYMMDD')}${index}.png`, { type: mime })
  }

  // 跳至fragment時間點
  jumpSpecifiedFragment(time: number) {
    console.log(time)
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', time)
  }

  // 刪除fragment
  deleteFragment(index: number) {
    this.editVideoFragments.splice(index, 1)
    console.log(this.editVideoFragments)
  }

}
