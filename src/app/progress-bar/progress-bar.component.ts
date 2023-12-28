import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  data = [
    {
      complete: 1,
      total: 10,
      process: 3
    },
    {
      complete: 3,
      total: 10,
      process: 3
    },
    {
      complete: 2,
      total: 10,
      process: 3
    }
  ]

  constructor() { }

  ngOnInit(): void {
    // this.addAnimation(
    //   `
    //   @keyframes width {
    //       0% {
    //         width: 0%
    //       }
    //       100% {
    //         width: 100%
    //       }
    //   };
    //   `
    // );
  }

  addAnimation(body){
    console.log('addAnimation')
    let style = document.createElement('style');
    style.innerText = body;
    document.head.appendChild(style)
}




}
