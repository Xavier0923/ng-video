import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'
import { from, Observable } from 'rxjs';
import { UploadImageService } from '../upload-image.service';

interface BrowserFullScreen extends Document {
  exitFullscreen: () => Promise<void>;
  mozCancelFullScreen: () => Promise<void>;
  webkitExitFullscreen: () => Promise<void>;
  msExitFullscreen: () => Promise<void>;
}

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
  timer: unknown;
  isError: boolean;
  isFullScreen: boolean = false;
  isLoading: boolean = false;
  document: BrowserFullScreen;

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
    console.log(this.videoWindow)
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // 載入影片
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadeddata', () => {
      console.log('is loaded')
      this.isLoading = false;
      this.totalSecondTime = this.videoPlayer.nativeElement.duration;
      // 總時間
      this.totalTime = moment.duration(this.videoPlayer.nativeElement.duration, 'seconds').format()
    })

    this.canvas = this.renderer.createElement("canvas");
    console.log(this.canvas)

    // 監聽更新時間
    this.renderer.listen(this.videoPlayer.nativeElement, 'timeupdate', () => {
      // 當前毫秒
      this.sliderTime = this.videoPlayer.nativeElement.currentTime;
      // 預載寫入畫布
      this.canvas.width = 400;
      this.canvas.height = 300;
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.image = this.canvas.toDataURL('image/jpeg');
    })

    this.renderer.listen(this.videoPlayer.nativeElement, 'waiting', () => {
      console.log('waiting')
      this.isLoading = true;
      this.isPlay = true;
    })

    this.videoPlayer.nativeElement.onplaying = () => {
      console.log('onplaying')
      this.isLoading = false;
      this.isPlay = true;
    }
    this.videoPlayer.nativeElement.oncanplay = () => {
      this.isPlay = false;
    }

    this.videoPlayer.nativeElement.onloadstart = () => {
      console.log('onloadstart')
      this.isLoading = true;
      this.isPlay = true;
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
      this.videoPlayer.nativeElement.play();
      console.log(this.videoPlayer.nativeElement.currentTime)
      this.timer = setInterval(() => {
        // 當前時間
        this.currentTime = this.videoPlayer.nativeElement.currentTime >= 1 ? moment.duration(this.videoPlayer.nativeElement.currentTime, 'seconds').format() : '0:00';
      }, 1000 / this.videoSpeed)
    } else {
      this.videoPlayer.nativeElement.pause();
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
  speedSetting() {
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
        this.uploadImageService.uploadImage(this.file).subscribe({
          next: (res) => {console.log(res);
          },
          error: (err) => {console.error(err)},
          complete: () => {
            console.log('complete!!')
          }
        })
    })
  }

  base64toBlob(imgBase64: string) {
    const blob = from(
      fetch(imgBase64)
        .then(res => res.blob())
        .then(blob => blob)
    )
    return blob

    // return blob
    // const canvas = this.renderer.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // const img = new Image();
    // img.onload = () => {
    //   canvas.height = img.height;
    //   canvas.width = img.width;
    //   ctx.drawImage(img, 0, 0)
    //   const dataURL = canvas.toDataURL('image/png');
    //   console.log(dataURL)
    // }
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
