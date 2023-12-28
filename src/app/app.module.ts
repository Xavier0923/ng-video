import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';

import { AppComponent } from './app.component';
import { CustomVideoPlayerComponent } from './custom-video-player/custom-video-player.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UploadImageService } from './upload-image.service';
import { JsonService } from 'src/services/json.service';
import { FormsModule } from '@angular/forms';


// Ngx-Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DomChangeDirective } from './directive/dom-change.directive';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ProgressStatusDirective } from './directive/progress-status.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableTestComponent } from './table-test/table-test.component';
import { AnimateTestComponent } from './animate-test/animate-test.component';

// 在根模組中 **(預設會使用「/assets/i18n/」及「.json」)**
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CustomVideoPlayerComponent,
    DomChangeDirective,
    SafeUrlPipe,
    ProgressBarComponent,
    ProgressStatusDirective,
    TableTestComponent,
    AnimateTestComponent,
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
    HttpClientModule,
    FormsModule,

    // 引入 TranslateModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatTooltipModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  providers: [UploadImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
