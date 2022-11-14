import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import videojs from 'video.js';
import 'videojs-hotkeys';
import 'videojs-seek-buttons';

interface VideoMarker {
  imgSrc: string,
  currentTime: string,
  secondTime: number
}

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;
  // See options: https://videojs.com/guides/options
  options: any;

  player!: videojs.Player;

  canvas: HTMLCanvasElement;

  videoMarkers: VideoMarker[] = [];
  currentTime: string;
  image: string;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.options = {
      preload: "auto",
      poster: "https://legendsdigitaltv.com/images/LDTV-Show-Pics/04-Movies/3-Animated-CGI/Big-Buck-Bunny.jpg",
      playbackRates: [0.5, 0.75, 1, 1.5, 1.75],
      controls: true,
      aspectRatio: '16:9',
      autoplay: false,
      sources: [{ src: 'assets/big_buck_bunny_720p_surround.mp4', type: 'video/mp4' }],
      plugins: { hotkeys: { enableModifiersForNumber: false, seekStep: 20 }, seekButtons: {forward: 10, back:10} }
    }
    console.log(this.videoPlayer)
    this.player = videojs(this.videoPlayer.nativeElement, this.options);

    // 刪除字母畫面
    const pictureInPicture = this.player.controlBar.getChild('pictureInPictureToggle')!;
    this.player.controlBar.removeChild(pictureInPicture)
    // 添加快轉到退鍵
    // const playbtn = this.player.controlBar.getChild("playToggle");
    // const playbtnindex = this.player.controlBar.children().indexOf(playbtn);
    // console.log('playbtn', playbtnindex)
    // const replaybtn = this.player.controlBar.addChild('button', {
    //   controlText: 'forward-10',
    //   className: 'vjs-control-text'
    // }, playbtnindex + 1)
    this.canvas = this.renderer.createElement("canvas");
    console.log(this.videoPlayer)
    this.renderer.listen(this.videoPlayer.nativeElement, 'timeupdate', () => {
      console.log('the video is updating!')
      this.canvas.width = 400;
      this.canvas.height = 300;
      let ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.videoPlayer.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.image = this.canvas.toDataURL('image/jpeg');
    })
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  getCurrentTime() {
    console.log(videojs.formatTime(this.player.currentTime(), 600))
    this.currentTime = videojs.formatTime(this.player.currentTime(), 600);
    this.videoMarkers.push({ imgSrc: this.image, currentTime: this.currentTime, secondTime: this.player.currentTime()})
    this.currentTime = ''
  }

  jumpSpecifiedFragment(time: number){
    this.player.currentTime(time);
  }

  deleteFragment(index: number){
    this.videoMarkers.splice(index, 1)
  }

}
