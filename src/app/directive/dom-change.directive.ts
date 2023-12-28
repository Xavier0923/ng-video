import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDomChange]'
})
export class DomChangeDirective {

  private changes: MutationObserver;

  @Output()
  public appDomChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    console.log('asd')
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // const watermarkDom = this.elementRef.nativeElement.firstElementChild;
    // console.log('watermarkDom', watermarkDom)
    // const className = this.elementRef.nativeElement.firstElementChild.className;

    console.log('run emit')
    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      // this.appDomChange.emit(mutations[0])
        // this.appDomChange.emit()
      mutations.forEach((mutation: MutationRecord) => this.appDomChange.emit());
    });

    this.changes.observe(this.elementRef.nativeElement, {
      childList: true,
    });

    // this.changes.disconnect();
    // this.changes = null;

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy')
    this.changes.disconnect();
    this.changes = null;
  }
}
