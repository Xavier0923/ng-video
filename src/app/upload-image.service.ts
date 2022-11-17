import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  fileUrl = 'C:/Users/cti111123/Documents/workspace/ctitv/video-file'

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<HttpResponse<any>>{
    console.log(file)
    // const formData = new FormData()
    // formData.append('file', file)
    return this.http.post<any>(this.fileUrl, file);
  }
}
