import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animate-test',
  templateUrl: './animate-test.component.html',
  styleUrls: ['./animate-test.component.scss'],
  animations: [
    trigger('openMoreQueryOption', [
      state(
        'open',
        style({
          height: '*',
          display: 'block',
          opacity: '100%',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          display: 'none',
          opacity: '0%',
        })
      ),
      transition('open <=> closed', [animate('0.5s cubic-bezier(.42,.14,.15,1.08)')]),
    ]),
  ],
})
export class AnimateTestComponent implements OnInit {

  isOpenMoreQuery: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
