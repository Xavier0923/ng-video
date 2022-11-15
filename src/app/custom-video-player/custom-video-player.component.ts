import { Component, OnInit, ElementRef, Renderer2, ViewChild, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format'
import { VideoDurationTimePipe } from '../video-duration-time.pipe';

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
  videoSpeed: number = 0;
  sliderPercent: number = 0;
  timer: unknown;
  @ViewChild('video') video!: ElementRef;

  constructor(private renderer: Renderer2, private videoDurationTimePipe: VideoDurationTimePipe) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // console.log(this.video.nativeElement)
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.renderer.listen(this.video.nativeElement, 'loadeddata', () => {
      this.totalSecondTime = this.video.nativeElement.duration;
      // 總時間
      // this.totalTime = this.videoDurationTimePipe.transform(this.video.nativeElement.duration);
      this.totalTime = moment.duration( this.video.nativeElement.duration, 'seconds').format()
      // console.log('this.totalTime', this.totalTime)
    })

    this.renderer.listen(this.video.nativeElement, 'timeupdate', () => {
      this.sliderPercent = Math.round(this.video.nativeElement.currentTime / this.video.nativeElement.duration * 10000) / 100
      console.log(this.sliderPercent)
    })

  }

  // 播放/暫停
  playVideo(e?: KeyboardEvent){
    console.log(e)
    if(!this.isPlay){
      this.video.nativeElement.play();
      this.timer = setInterval(() => {
        // 當前時間
        this.currentTime = this.video.nativeElement.currentTime >= 1 ? moment.duration( this.video.nativeElement.currentTime, 'seconds').format() : '0:00';
      },1000)
    } else {
      this.video.nativeElement.pause();
    }
    this.isPlay = !this.isPlay;

  }

  // 快轉/倒退
  dataSkip(value: number){
    if(value > 0){
      this.renderer.setProperty(this.video.nativeElement, 'currentTime', this.video.nativeElement.currentTime + 10)
    } else {
      this.renderer.setProperty(this.video.nativeElement, 'currentTime', this.video.nativeElement.currentTime - 10)
    }
  }

  // 聲音是否靜音
  volumeMuted(){
    this.renderer.setProperty(this.video.nativeElement, 'muted', !this.video.nativeElement.muted)
    this.isMuted = !this.isMuted;
  }

  // 聲音大小聲
  volumeControl(event: any){
    this.renderer.setProperty(this.video.nativeElement, 'volume', event.value / 100)
  }

  // 移動時間點
  timeControl(event: any){
    // 計算進度條百分比
    let progressBarScore = (this.video.nativeElement.duration * event.value) / 100
    this.currentTime = this.video.nativeElement.currentTime >= 1 ? moment.duration( progressBarScore, 'seconds').format() : '0:00';
    this.renderer.setProperty(this.video.nativeElement, 'currentTime', progressBarScore)
  }

  // 放大/縮小
  fullScreen(){
    this.video.nativeElement.requestFullscreen();
    this.renderer.setProperty(this.video.nativeElement, 'controls', false)
  }

  // 打開設定
  speedSetting(){
    this.showSetting = !this.showSetting;
  }

}
