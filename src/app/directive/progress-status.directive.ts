import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appProgressStatus]'
})
export class ProgressStatusDirective {

  constructor(private el: ElementRef) {
  }

}
