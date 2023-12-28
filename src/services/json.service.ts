import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class JsonService {

  constructor(private http: HttpClient) { }

  getJson() {
    return this.http.get(
      'https://my-json-server.typicode.com/typicode/demo/posts'
    );
  }

  getFile(url: string){
    return this.http.get(url, {responseType: 'blob'})
  }
}
