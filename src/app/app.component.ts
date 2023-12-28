import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-video';
  isShowVideo = true;
  test = '';

  constructor(public translate: TranslateService){
    translate.addLangs(['zh-TW', 'es-US']);
    translate.setDefaultLang('zh-TW');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/zh-TW|es-US/) ? browserLang : 'zh-TW');
  }

  selectVideo(){
    this.isShowVideo = false;
    setTimeout(() => {
      this.isShowVideo = true;
    })
  }
  
}
