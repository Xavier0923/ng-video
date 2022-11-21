import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'
import { from, Observable } from 'rxjs';
import { UploadImageService } from '../upload-image.service';

// interface BrowserFullScreen extends Document {
//   exitFullscreen: () => Promise<void>;
//   mozCancelFullScreen: () => Promise<void>;
//   webkitExitFullscreen: () => Promise<void>;
//   msExitFullscreen: () => Promise<void>;
// }

interface VideoMarker {
  imgSrc: string,
  currentTime: string,
  secondTime: number
}

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
  timer: ReturnType<typeof setInterval>;
  isError: boolean;
  isFullScreen: boolean = false;
  isLoading: boolean = false;

  canvas: HTMLCanvasElement;
  videoMarkers: VideoMarker[] = [];
  image: string;
  imageBlob: Observable<Blob>;
  file: File;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('videoWindow') videoWindow!: ElementRef;

  constructor(private renderer: Renderer2, private uploadImageService: UploadImageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // 載入影片
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadeddata', () => {
      console.log('is loaded')
      this.isLoading = false;
      this.totalSecondTime = this.videoPlayer.nativeElement.duration;
      // 總時間
      this.totalTime = moment.duration(this.videoPlayer.nativeElement.duration, 'seconds').format()
    })

    this.canvas = this.renderer.createElement("canvas");

    // 監聽更新時間
    this.renderer.listen(this.videoPlayer.nativeElement, 'timeupdate', () => {
      // 當前毫秒
      this.sliderTime = this.videoPlayer.nativeElement.currentTime;
      // 預載寫入畫布
      console.log(this.videoPlayer.nativeElement.width)
      this.renderer.setAttribute(this.canvas, 'width', '1600');
      this.renderer.setAttribute(this.canvas, 'height', '900');
      // this.canvas.width = this.videoPlayer.nativeElement.width;
      // this.canvas.height = this.videoPlayer.nativeElement.height;
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, 1600, 900);
      this.image = this.canvas.toDataURL('image/png');
      // console.log(this.image)
    })

    // 緩衝中
    this.renderer.listen(this.videoPlayer.nativeElement, 'waiting', () => {
      console.log('waiting')
      this.isLoading = true;
      this.isPlay = true;
    })

    // 播放中
    this.videoPlayer.nativeElement.onplaying = () => {
      console.log('onplaying')
      this.isLoading = false;
      this.isPlay = true;
    }

    // 是否可以播放
    this.videoPlayer.nativeElement.oncanplay = () => {
      console.log('oncanplay')
      this.isPlay = false;
    }

    // 開始載入
    this.videoPlayer.nativeElement.onloadstart = () => {
      console.log('onloadstart')
      this.isLoading = true;
      this.isPlay = true;
    }

    this.renderer.listen(window, 'click', () => {
      this.showSetting = false;
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


  }

  // 播放/暫停
  playVideo() {
    if (!this.isPlay) {
      this.videoPlayer.nativeElement.play();
      this.timer = setInterval(() => {
        this.currentTime = moment.duration((this.videoPlayer.nativeElement.currentTime < 1 ? 1 : this.videoPlayer.nativeElement.currentTime), 'seconds').format();
      }, 1000 / this.videoSpeed)
    } else {
      this.videoPlayer.nativeElement.pause();
      clearInterval(this.timer);
    }
    this.isPlay = !this.isPlay;

  }

  // 快轉/倒退
  dataSkip(value: number) {
    if (value > 0) {
      this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', this.videoPlayer.nativeElement.currentTime + 10)
    } else {
      this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', this.videoPlayer.nativeElement.currentTime - 10)
    }
  }

  // 聲音是否靜音
  volumeMuted() {
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'muted', !this.videoPlayer.nativeElement.muted)
    this.isMuted = !this.isMuted;
    this.volume = this.isMuted ? 0 : 50;
  }

  // 聲音大小聲
  volumeControl(event: any) {
    console.log(event.value)
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'volume', event.value / 100)
    this.isMuted = event.value === 0 ? true : false;
  }

  // 移動時間點
  timeControl(event: any) {
    // 進度條
    this.currentTime = this.videoPlayer.nativeElement.currentTime > 0 ? moment.duration(event.value, 'seconds').format() : '0:00';
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', event.value)
  }

  // 放大/縮小
  fullScreen() {

    if (this.isFullScreen) {
      console.log(document.exitFullscreen())
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }

      //   else if (this.document.webkitExitFullscreen) { /* Safari */
      //   this.document.webkitExitFullscreen();
      // } else if (this.document.msExitFullscreen) { /* IE11 */
      //   this.document.msExitFullscreen();
      // }
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
    }
    console.log(this.isFullScreen)
  }

  // 打開設定
  speedSetting(e: any) {
    e.stopPropagation()
    this.showSetting = !this.showSetting;
  }

  // 調整播放速度
  setPlaySpeed(value: number) {
    this.videoSpeed = value;
    this.videoPlayer.nativeElement.playbackRate = value;
    this.showSetting = !this.showSetting;
  }

  // 擷取畫面
  getVideoMarker() {
    console.log(this.currentTime)
    this.videoMarkers.push({ imgSrc: this.image, currentTime: this.currentTime, secondTime: this.videoPlayer.nativeElement.currentTime })
    this.imageBlob = this.base64toBlob(this.image)
    this.imageBlob.subscribe(res => {
        this.file = new File([res], 'asd', { type: 'image/png' })
    })
  }

  base64toBlob(imgBase64: string) {
    const blob = from(
      fetch(imgBase64)
        .then(res => res.blob())
        .then(blob => blob)
    )
    return blob
  }

  // 跳至marker時間點
  jumpSpecifiedFragment(time: number) {
    this.videoPlayer.nativeElement.currentTime = time;
  }

  // 刪除marker
  deleteFragment(index: number) {
    this.videoMarkers.splice(index, 1)
  }

}
