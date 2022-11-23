import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  fileUrl = 'file://10.227.24.121/low_resolution/2022/202209/20220901/202209010001/202209010001_thumbnail.jpg'

  constructor(private http: HttpClient) { }

  getFile(){
    return this.http.get<any>(this.fileUrl);
  }
}
