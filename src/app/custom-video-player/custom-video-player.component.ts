import { UploadImageService } from './../upload-image.service';
import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'
import { JsonService } from 'src/services/json.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  styleUrls: ['./custom-video-player.component.scss'],
  providers: [JsonService]
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
  isEnd = false;

  // 文字顯示時間
  totalTime = ''
  currentTime = '0:00';
  // 數字顯示時間
  durationTime = 0;
  progressTime = 0;
  // 百分比
  percentTime = 0;
  loadedPercentage = 0;

  // 擷取屬性
  canvas!: HTMLCanvasElement;
  base64Url = '';
  imageIndex = 0;
  file: File;

  // 讀檔測試
  testReadFile = new FileReader();

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('videoWindow') videoWindow: ElementRef;
  @ViewChild('speedSetting') speedSetting: ElementRef;
  @ViewChild('videoProgress') videoProgress: ElementRef;

  // @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('volumeControlInp') volumeControlInp: ElementRef;
  @ViewChild('progressTimeInp') progressTimeInp: ElementRef;


  @ViewChild('watermark') watermark: ElementRef;


  // api 來的
  videoFragments: VideoFragments;

  // 修改
  editVideoFragments: Fragments[];

  // 網址
  videofile = 'assets\\20220901\\202209010001.mp4';
  videoImage = 'assets\\20220901\\202209010001_thumbnail.jpg';
  videoFileUrl: SafeResourceUrl;
  videoImageUrl: SafeResourceUrl;
  videofileblob;
  videoImageblob;

  constructor(private renderer: Renderer2, private jsonService: JsonService, private ele: ElementRef,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getData();
    this.jsonService.getJson().subscribe(res => console.log(res));
    // this.videoFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videofile);
    // this.videoImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoImage);
    // 透過api轉網址 video
    this.jsonService.getFile(URL.createObjectURL(new Blob([this.videofile]))).subscribe((res) => {
      console.log('video res', res)
      this.videofile = URL.createObjectURL(res);
    })
    // 直接轉網址 video
    // this.videofileblob = new Blob([this.videofileblob]);
    // this.videofile = URL.createObjectURL(this.videofileblob);
    // this.videoFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videofile);

    // 直接轉網址 image
    // this.videoImageblob = new Blob([this.videoImage]);
    // this.videoImage = URL.createObjectURL(this.videoImageblob);
    // this.videoImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoImage);

    // 透過api轉網址 image
    // this.jsonService.getFile(URL.createObjectURL(new Blob([this.videoImage]))).subscribe((res) => {
    //   console.log('image res', res);
    //   this.videoImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
    // })
    this.videoImageUrl = this.videoImage;
    // this.watermarkObserve();

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // 讀檔測試
    this.testReadFile.onerror = () => {
      console.log('file error')
    }

    // 事件
    //onloadeddata
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadeddata', () => {
      console.log('loadeddata')
      this.isError = false;
      this.isPlay = false;
      this.isLoading = false;
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
      this.renderer.setStyle(this.progressTimeInp.nativeElement, 'background', `linear-gradient(to right, red ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%, rgba(173, 173, 173, 0.5) ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%)`)
      // this.percentTime = (this.progressTime / this.durationTime) * 100;
      // 預載寫入畫布
      this.canvas = this.renderer.createElement('canvas');
      this.canvas.width = 1600;
      this.canvas.height = 900;
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, 1600, 900);
      this.base64Url = this.canvas.toDataURL()

    })
    // playing
    this.renderer.listen(this.videoPlayer.nativeElement, 'playing', () => {
      console.log('playing')
      this.isError = false;
      this.isLoading = false;
    })
    //waiting
    this.renderer.listen(this.videoPlayer.nativeElement, 'waiting', () => {
      console.log('waiting')
      this.isLoading = true;
      if(this.videoPlayer.nativeElement.readyState === 0){
        alert('影片讀取失敗');
        this.isLoading = false;
        this.isError = true;
      }
      // 處理緩衝
    })

    // end
    this.renderer.listen(this.videoPlayer.nativeElement, 'ended', () => {
      console.log('ended');
      this.isEnd = true;
    })

    // 加載中止
    this.renderer.listen(this.videoPlayer.nativeElement, 'abort', () => {
      console.log('abort')
    })

    // 持續時間已修改
    this.renderer.listen(this.videoPlayer.nativeElement, 'durationchange', () => {
      console.log('durationchange')
    })

    // 錯誤
    this.renderer.listen(this.videoPlayer.nativeElement, 'error', () => {
      console.log('error')
      this.isError = true;
      this.isLoading = false;
      this.isPlay = false;
    })

    // 視頻開始加載
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadstart', () => {
      console.log('loadstart', this.videoPlayer.nativeElement.readyState)
    })


    // 瀏覽器無法獲取媒體數據
    this.renderer.listen(this.videoPlayer.nativeElement, 'stalled', () => {
      console.log('stalled')
    })

    // 正在下載
    this.renderer.listen(this.videoPlayer.nativeElement, 'progress', () => {
      //  this.loadedPercentage = this.videoPlayer.nativeElement.buffered.end(0) / this.durationTime;
      console.log('progress', this.loadedPercentage)
    })

    // 警告媒體數據的加載被阻止繼續
    this.renderer.listen(this.videoPlayer.nativeElement, 'suspend', () => {
      console.log('suspend')
    })

    // 加載視頻的元數據時發出警報
    this.renderer.listen(this.videoPlayer.nativeElement, 'loadedmetadata', () => {
      console.log('loadedmetadata')
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

  // 重新加載影片
  reloadVideo() {
    this.videoPlayer.nativeElement.load()
  }

  // 重新播放
  replayVideo() {
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', 0)
    this.isEnd = false;
    this.videoPlayer.nativeElement.play()
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
    this.renderer.setStyle(this.volumeControlInp.nativeElement, 'background', `linear-gradient(to right,#fff ${this.volume}%, rgba(173, 173, 173, 0.5) ${this.volume}%)`)
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
    this.renderer.setStyle(this.volumeControlInp.nativeElement, 'background', `linear-gradient(to right,#fff ${this.volume}%, rgba(173, 173, 173, 0.5) ${this.volume}%)`)
  }

  // 時間軸
  timeControl(event: any) {
    // console.log(event.target.value)
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', event.target.value)
    console.log(`linear-gradient: (to right, red ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%, #fff ${((this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100).toFixed(3)}%)`)
    this.renderer.setStyle(this.progressTimeInp.nativeElement, 'background', `linear-gradient(to right, red ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%, rgba(173, 173, 173, 0.5) ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%)`)
    // this.renderer.setStyle(this.progressTimeInp.nativeElement, 'background', `linear-gradient(to right,
    //   blue 0%,
    //   blue ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%,
    //   #777 ${(this.videoPlayer.nativeElement.currentTime / this.videoPlayer.nativeElement.duration) * 100}%,
    //   #777 ${this.loadedPercentage * 100}%,
    //   #444 ${this.loadedPercentage * 100}%,
    //   #444 100%`);
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


  // 監聽浮水印的dom 元素變化
  // onDomChange(element): void {
  //   console.log('element', element);
  //   if(element){
  //     const waterMarkParentDom = this.ele.nativeElement.querySelector('.watermark-block');
  //     // const waterMarkChildDom = this.renderer.createElement('div')
  //     const videoPlayer = this.ele.nativeElement.querySelector('.video-player');
  //     this.renderer.addClass(element, 'new-watermark');
  //     this.renderer.removeClass(element, 'watermark');
  //     this.renderer.insertBefore(waterMarkParentDom, element, videoPlayer);
  //   }

  watermarkObserve(){
    const waterMarkParentDom = this.ele.nativeElement.querySelector('.watermark-block');
    const changes = new MutationObserver((mutationList: MutationRecord[]) => {
        // this.appDomChange.emit(mutations[0])
        // this.appDomChange.emit()
        for (let mutation of mutationList){
          console.log('mutation', mutation)
          const type = mutation.type
          if(type === 'childList' && mutation.removedNodes.length > 0){
            mutation.target.appendChild(mutation.removedNodes[0]);
            break;
          }
        };
    });
    changes.observe(waterMarkParentDom, {
      childList: true,
    });
  }

  // }

  // 刪除浮水印
  deleteDom(){
    this.watermark.nativeElement.remove();
  }

}
