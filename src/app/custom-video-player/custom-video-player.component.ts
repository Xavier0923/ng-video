import { Component, OnInit, ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'

// interface Document {
//   exitFullscreen: () => void;
//   mozCancelFullScreen: () => void;
//   webkitExitFullscreen: () => void;
// }

@Component({
  selector: 'app-custom-video-player',
  templateUrl: './custom-video-player.component.html',
  styleUrls: ['./custom-video-player.component.scss']
})
export class CustomVideoPlayerComponent implements OnInit {

  title = 'video-test';
  isPlay: boolean = false;
  volume: number | null = 50;
  isMuted: boolean = false;
  totalSecondTime: number;
  totalTime: string = '';
  currentTime: string = '0:00'
  showSetting: boolean = false;
  videoSpeed: number = 1;
  sliderTime: number = 0;
  timer: unknown;
  isError: boolean;
  isFullScreen: boolean = false;
  isLoading: boolean = false;
  @ViewChild('video') video!: ElementRef;
  @ViewChild('videoWindow') videoWindow!: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.videoWindow)
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // 載入影片
    this.renderer.listen(this.video.nativeElement, 'loadeddata', () => {
      console.log('is loaded')
      this.isLoading = false;
      this.totalSecondTime = this.video.nativeElement.duration;
      // 總時間
      this.totalTime = moment.duration(this.video.nativeElement.duration, 'seconds').format()
    })

    // 監聽更新時間
    this.renderer.listen(this.video.nativeElement, 'timeupdate', () => {
      this.sliderTime = this.video.nativeElement.currentTime;
    })

    this.renderer.listen(this.video.nativeElement, 'waiting' , () => {
      console.log('waiting')
      this.isLoading = true;
    })

    this.video.nativeElement.onplaying = () => {
      console.log('onplaying')
      this.isLoading = false;
    }

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


  }

  // 播放/暫停
  playVideo() {
    if (!this.isPlay) {
      this.video.nativeElement.play();
      console.log(this.video.nativeElement.currentTime)
      this.timer = setInterval(() => {
        // 當前時間
        this.currentTime = this.video.nativeElement.currentTime >= 1 ? moment.duration(this.video.nativeElement.currentTime, 'seconds').format() : '0:00';
      }, 1000 / this.videoSpeed)
    } else {
      this.video.nativeElement.pause();
    }
    this.isPlay = !this.isPlay;

  }

  // 快轉/倒退
  dataSkip(value: number) {
    if (value > 0) {
      this.renderer.setProperty(this.video.nativeElement, 'currentTime', this.video.nativeElement.currentTime + 10)
    } else {
      this.renderer.setProperty(this.video.nativeElement, 'currentTime', this.video.nativeElement.currentTime - 10)
    }
  }

  // 聲音是否靜音
  volumeMuted() {
    this.renderer.setProperty(this.video.nativeElement, 'muted', !this.video.nativeElement.muted)
    this.isMuted = !this.isMuted;
  }

  // 聲音大小聲
  volumeControl(event: any) {
    this.renderer.setProperty(this.video.nativeElement, 'volume', event.value / 100)
  }

  // 移動時間點
  timeControl(event: any) {
    // 進度條
    this.currentTime = this.video.nativeElement.currentTime > 0 ? moment.duration(event.value, 'seconds').format() : '0:00';
    this.renderer.setProperty(this.video.nativeElement, 'currentTime', event.value)
  }

  // 放大/縮小
  fullScreen() {
    if (this.isFullScreen) {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (this.videoWindow.nativeElement.webkitRequestFullscreen) {
        this.videoWindow.nativeElement.webkitRequestFullscreen()
      } else if (this.videoWindow.nativeElement.requestFullscreen) {
        this.videoWindow.nativeElement.requestFullscreen()
      } else if (this.videoWindow.nativeElement.msRequestFullscreen) {
        this.videoWindow.nativeElement.msRequestFullscreen()
      }
    }
    console.log(this.isFullScreen)
  }

  // 打開設定
  speedSetting() {
    this.showSetting = !this.showSetting;
  }

  // 調整播放速度
  setPlaySpeed(value: number) {
    this.videoSpeed = value;
    this.video.nativeElement.playbackRate = value;
    this.showSetting = !this.showSetting;
  }

}
