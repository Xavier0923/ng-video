import { UploadImageService } from './../upload-image.service';
import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'

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

  isPlay = false;
  volume: number | null = 50;
  isMuted = false;
  totalSecondTime = 0;
  totalTime = '';
  currentTime = '0:00'
  showSetting = false;
  videoSpeed = 1;
  sliderTime = 0;
  timer!: ReturnType<typeof setInterval>;
  isError = false;
  isFullScreen = false;
  isLoading = false;

  canvas!: HTMLCanvasElement;
  videoMarkers: VideoMarker[] = [];
  image = '';
  file!: File;
  imageIndex = 0;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoWindow') videoWindow!: ElementRef;

  constructor(private renderer: Renderer2, private uploadImageService: UploadImageService) { }

  ngOnInit(): void {
    // this.uploadImageService.getFile().subscribe((res) => {
    //   console.log(res);
    // })
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
      console.log('timeupdate')
      // 更新當前時間
      this.timer = setInterval(() => {
        // this.currentTime = moment.duration((this.videoPlayer.nativeElement.currentTime < 1 ? 1 : this.videoPlayer.nativeElement.currentTime), 'seconds').format();
        this.currentTime = moment.duration((this.videoPlayer.nativeElement.currentTime), 'seconds').format();
      }, 1000 / this.videoSpeed)
      // 當前毫秒
      this.sliderTime = this.videoPlayer.nativeElement.currentTime;
      // 預載寫入畫布
      this.renderer.setAttribute(this.canvas, 'width', '1600');
      this.renderer.setAttribute(this.canvas, 'height', '900');
      const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, 1600, 900);
      this.image = this.canvas.toDataURL('image/png');
    })

    // 緩衝中
    this.renderer.listen(this.videoPlayer.nativeElement, 'waiting', () => {
      console.log('waiting')
      this.isLoading = true;
      // this.isPlay = true;
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
    }

    // 開始載入
    this.videoPlayer.nativeElement.onloadstart = () => {
      console.log('onloadstart')
      this.isLoading = true;
      this.isPlay = false;
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
    } else {
      this.videoPlayer.nativeElement.pause();
      clearInterval(this.timer);
      this.isLoading = false;
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
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'volume', event.target.value / 100)
    this.isMuted = event.target.value === 0 ? true : false;
  }

  // 移動時間點
  timeControl(event: any) {
    // 進度條
    this.currentTime = this.videoPlayer.nativeElement.currentTime > 0 ? moment.duration(event.target.value, 'seconds').format() : '0:00';
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', event.target.value)
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
    this.file = this.base64toFile(this.image);
    // this.downloadFile();
  }

  base64toFile(dataURI: string) {
      // 分割数据
      const [meta, data] = dataURI.split(',')
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
      // 生成文件对象
      return new File([ia], `${moment().format('yyyy/MM/DD hh:mm')}截圖-${this.imageIndex}.png`, { type: mime })
  }

  // 跳至marker時間點
  jumpSpecifiedFragment(time: number) {
    this.videoPlayer.nativeElement.currentTime = time;
  }

  // 刪除marker
  deleteFragment(index: number) {
    this.videoMarkers.splice(index, 1)
  }

  // downloadFile(){
  //   const a = this.renderer.createElement('a')
  //   a.href = this.file;
  //   a.click();
  // }

}
