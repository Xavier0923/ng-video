import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { CustomVideoPlayerComponent } from './custom-video-player/custom-video-player.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UploadImageService } from './upload-image.service';

@NgModule({
  declarations: [
    AppComponent,
    CustomVideoPlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [UploadImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
