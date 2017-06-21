import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResCarouselDirective } from './ng-rescarousel.directive';

export { ResCarouselDirective } from './ng-rescarousel.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ResCarouselDirective],
  exports: [ResCarouselDirective]
})
export class ResCarouselModule { }
