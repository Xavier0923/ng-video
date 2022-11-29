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
  remake: string;
  temporaryUrl?: string;
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
  isMuted = false;
  totalTime = '';
  currentTime = '0:00';
  showSetting = false;
  videoSpeed = 1;
  progressTime = 0;
  // isError = false;
  isFullScreen = false;
  // isLoading = false;

  canvas!: HTMLCanvasElement;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @ViewChild('videoWindow') videoWindow: ElementRef;

  videoFragments: VideoFragments = {
    url: 'assets/20220901/',
    fragments: [
        {
            imgName: '202209010001_00001700.png',
            currentTime: '00:00:17.000',
            secondsTime: 17,
            remake: 'asd',
        },
        {
            imgName: '202209010001_00014700.png',
            currentTime: '00:01:47.455',
            secondsTime: 107.455498,
            remake: 'zxc',
        },
        {
            imgName: '202209010001_00025400.png',
            currentTime: '00:02:54.000',
            secondsTime: 174,
            remake: 'zxc',
        },
        {
            imgName: '202209010001_00025400.png',
            currentTime: '00:01:40.950',
            secondsTime: 100.950533,
            remake: 'zxc',
        },
    ]
  };

  constructor(private renderer: Renderer2){}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.videoPlayer)
    console.log(this.videoWindow)
  }
  // 取資料
  //getData

  // 事件
  //onloadeddata

  //timeupdate

  //waiting

  // 控制方法
  // 播放/暫停
  playVideo(){
    if(!this.isPlay){
      this.videoPlayer.nativeElement.play()
    } else {
      this.videoPlayer.nativeElement.pause()
    }
    this.isPlay = !this.isPlay
  }

  // 快轉\倒退
  videoSkip(value: number){
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'currentTime', this.videoPlayer.nativeElement.currentTime + value);
  }

  // 靜音開關
  volumeMuted(){
    this.renderer.setProperty(this.videoPlayer.nativeElement, 'muted', !this.videoPlayer.nativeElement.muted)
    this.isMuted = !this.isMuted;
    // 需要將音量轉至0
    this.volume = this.isMuted ? 0 : 50;
  }

  // 音量
  volumeControl(){

  }

  // 時間軸
  timeControl(){

  }

  // 速度
  speedControl(){

  }

  // 全螢幕
  fullScreen(){

  }

}
