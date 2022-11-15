import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { CustomVideoPlayerComponent } from './custom-video-player/custom-video-player.component';
import { VideoDurationTimePipe } from './video-duration-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    CustomVideoPlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule
  ],
  providers: [VideoDurationTimePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
