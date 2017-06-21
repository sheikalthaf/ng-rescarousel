import { Directive, ElementRef, Renderer, Input, Output, OnInit, HostListener, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ResCarousel]'
})
export class ResCarouselDirective {

    @Input() items: any;
    @Input() slide: number;
    @Input() interval: number;
    @Input() speed: number;
    @Input() load: number;
    @Input() animator: any;
    @Output() ResCarouselLoad: EventEmitter<any> = new EventEmitter();

    private resCarousel: any;
    private resCarouselInner: any;
    private resCarouselItems: any;

    private itemWidth: number;
    private currentSlide: number;
    private ResResize: any;
    private visibleItems: number;
    private slideItems: number;
    private scrolledItems: number;
    @Output() resPoint: any;

    // @HostBinding() loader;

    constructor(
      private el: ElementRef,
      private renderer: Renderer) {
      // renderer.setElementStyle(el.nativeElement, 'background', 'grey');
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit() {
      this.resCarousel = this.el.nativeElement;
      this.resCarouselInner = this.resCarousel.getElementsByClassName('resCarousel-inner')[0];
      this.resCarouselItems = this.resCarouselInner.getElementsByClassName('item');
      this.ResCarouselSize();
      this.resCarousel.querySelector('.rightRs').addEventListener('click', () => { this.ResCarousel(1); });
      this.resCarousel.querySelector('.leftRs').addEventListener('click', () => { this.ResCarousel(0); });
      this.resCarouselInner.onscroll = () => {
        this.scrollStart();
      }
    }

    // @HostListener('click', ['$event.target'])
    //     handleClick(event: Event) {
    //     }
    @HostListener('mouseenter') onmouseenter() {
      this.renderer.setElementClass(this.resCarousel, 'ResHovered', true);
    }

    @HostListener('mouseleave') onmouseleave() {
      this.renderer.setElementClass(this.resCarousel, 'ResHovered', false);
    }

    @HostListener('window:resize')
    onResize() {
      // console.log(event);
      clearTimeout(this.ResResize);
      this.ResResize = setTimeout(() => { this.storeResData(); }, 500);
    }

    private storeResData() {
        const windowWidth = window.innerWidth;
        // tslint:disable-next-line:max-line-length
        this.visibleItems = +(windowWidth >= 1200 ? this.items.lg : windowWidth >= 992 ? this.items.md : windowWidth >= 768 ? this.items.sm : this.items.xs);
        this.itemWidth = this.resCarouselInner.offsetWidth / this.visibleItems;
        this.resCarouselInner.scrollLeft = this.currentSlide * this.itemWidth;
        this.scrolledItems = Math.round(this.resCarouselInner.scrollLeft / this.itemWidth);
        this.slideItems = this.slide < this.visibleItems ? this.slide : this.visibleItems;
        this.speed = this.speed ? this.speed : 400;
    }

    private resCarouselPoint() {
        const Nos = this.resCarouselItems.length - (this.visibleItems - this.slideItems);
        const p = Math.ceil(Nos / this.slideItems);

        let point = '<div class="resPoint"><ul>'
        for (let i = 0; i < p; i++) {
            if (i === 0) {
                point += '<li class="active"></li>';
            } else {
                point += '<li></li>';
            }
        }
        point += '</ul></div>';
        const respo = this.resCarousel.querySelectorAll('.resPoint');
        // console.log(!respo.length);
        // tslint:disable-next-line:no-unused-expression
         if (respo.length > 0) {
           for (let i = 0; i <= respo.length; i++) {
             respo[i].remove();
           }
            // respo.parentNode.remove();
         }
        this.resCarousel.insertAdjacentHTML('beforeend', point);
        // parent.find('.resPoint').remove();
    }

    private scrollStart() {
      const scro = Math.round(this.resCarouselInner.scrollLeft / this.itemWidth);
      this.resCarouselPointActive(scro);
      // console.log(scro);
    }

    private resCarouselPointActive(start: number) {
      // console.log(start);
        const parent = this.resCarousel.querySelectorAll('.resPoint li');
        const i = Math.ceil(start / this.slideItems);
        if (!parent[i]) { this.resCarouselPoint(); }
        for (let j = 0; j < parent.length; j++) {
            this.renderer.setElementClass(parent[j], 'active', false);
        }
        this.renderer.setElementClass(parent[i], 'active', true);
    }

    private ResCarouselSize() {
        const itemsSplit = this.items.split('-');
        this.items = {
          'xs': itemsSplit[0],
          'sm': itemsSplit[1],
          'md': itemsSplit[2],
          'lg': itemsSplit[3]
        }
        const index = + Math.round( Math.random() * (1000 - 10) + 10);

        const styleCollector0: string = '.ResSlid' + index + ' .item {width: ' + 100 / itemsSplit[0] + '%}';
        const styleCollector1: string = '.ResSlid' + index + ' .item {width: ' + 100 / itemsSplit[1] + '%}';
        const styleCollector2: string = '.ResSlid' + index + ' .item {width: ' + 100 / itemsSplit[2] + '%}';
        const styleCollector3: string = '.ResSlid' + index + ' .item {width: ' + 100 / itemsSplit[3] + '%}';

        // tslint:disable-next-line:max-line-length
        const styleCollector = '<div><style>.resCarousel { width: 100%; position: relative; }.resCarousel-inner { overflow-x: hidden; white-space: nowrap; font-size: 0; vertical-align: top;}' +
        '.resCarousel-inner .item { display: inline-block; font-size: 14px; white-space: initial;}' +
                                            '@media (max-width:767px){.resCarousel-inner {overflow-x: auto; }' + styleCollector0 + '}' +
                                            '@media (min-width:768px){' + styleCollector1 + '}' +
                                            '@media (min-width:992px){' + styleCollector2 + '}' +
                                            '@media (min-width:1200px){' + styleCollector3 + '}</style></div>';

        // console.log(styleCollector)
        this.renderer.setElementClass(this.resCarousel, 'ResSlid' + index, true);
        this.resCarousel.insertAdjacentHTML('beforeend', styleCollector);
        // tslint:disable-next-line:no-unused-expression
        this.animator === 'lazy' && this.renderer.setElementClass(this.resCarousel, 'resCarouselLazy', true);
        // tslint:disable-next-line:no-unused-expression
        typeof this.interval === 'number' && this.ResCarouselSlide();
        this.storeResData();
        this.resCarouselPoint();
        // this.ResCarousel('Btn');
    }

    private ResCarouselSlide() {
        setInterval(() => {
           // tslint:disable-next-line:no-unused-expression
    		    !(this.resCarousel.classList.contains('ResHovered')) && this.ResCarousel(1);
        }, this.interval);
    }

    public ResCarousel(Btn: number) {
        // let t0 = performance.now();
        let itemSpeed = +this.speed;
        let translateXval, currentSlide = 0;
        const itemLenght = this.resCarouselItems.length;
        // const itemWidth = this.resCarouselItems[0].offsetWidth;
        const divValue = Math.round(this.resCarouselInner.scrollLeft / this.itemWidth);

        if (Btn === 0) {
            currentSlide = divValue - this.slideItems;
            translateXval = currentSlide * this.itemWidth;
            const MoveSlide = currentSlide + this.slideItems;

            if (divValue === 0) {
                currentSlide = itemLenght - this.slideItems;
                translateXval = currentSlide * this.itemWidth;
                currentSlide = itemLenght - this.visibleItems;
                itemSpeed = 400;
                Btn = 1;
            } else if (this.slideItems >= MoveSlide) {
                currentSlide = translateXval = 0;
            }
        } else {
            currentSlide = divValue + this.slideItems;
            translateXval = currentSlide * this.itemWidth;
            const MoveSlide = currentSlide + this.slideItems;

            if (divValue + this.visibleItems === itemLenght) {
                currentSlide = translateXval = 0;
                itemSpeed = 400;
                Btn = 0;
            } else if (itemLenght <= (MoveSlide - this.slideItems + this.visibleItems)) {
                currentSlide = itemLenght - this.slideItems;
                translateXval = currentSlide * this.itemWidth;
                currentSlide = itemLenght - this.visibleItems;
            }
        }


        // let cons = {
        //   'currentSlide': currentSlide + 1,
        //   'endSlide': currentSlide + this.visibleItems,
        //   'speed': itemSpeed,
        //   'divValue': Math.abs(divValue - currentSlide)
        // }
        // console.log(cons);

        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:no-unused-expression
        this.animator === 'lazy' && this.resCarouselAnimator( Btn, currentSlide + 1, currentSlide + this.visibleItems, itemSpeed, Math.abs(divValue - currentSlide));
        this.currentSlide = currentSlide;
        // tslint:disable-next-line:no-unused-expression
        this.load && this.ResCarouselLoad1();
        this.smoothScoll(translateXval, itemSpeed);
        // this.scrollTo(this.resCarouselInner, translateXval, itemSpeed);
        // this.resCarouselPointActive(currentSlide);
        // this.chng.markForCheck();

         // let t1 = performance.now();
         // console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
    }

    private ResCarouselLoad1() {
      this.load = this.load >= this.slideItems ? this.load : this.slideItems;
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:no-unused-expression
      (this.resCarouselItems.length - this.load) <= (this.currentSlide + this.visibleItems) && this.ResCarouselLoad.emit(this.currentSlide) && console.log('asd');
    }

    private smoothScoll(obj: number, speed: number) {
      // console.log(obj + ',' + params + ',' + speed)
        const startX = this.resCarouselInner.scrollLeft;
        const stopX = obj;
        const distance = stopX > startX ? stopX - startX : startX - stopX;
        // let speed = Math.round(distance / 100);
        //    if (speed >= 20) speed = 20;
        /// const rol = Math.round(distance/speed)*10+10;
        const rol = 13;
        // console.log(rol);
        const step = Math.round(speed / rol);
        const addr = distance / step;
        // let leapX = stopX > startX ? startX + addr : startX - addr;
        let leapX = startX;
          if (stopX > startX) {
              for (let i = 0; i <= speed; i += rol) {
                setTimeout(() => {
                    leapX += addr
                    //console.log(i);
                    if (Math.round(leapX) + 5 >= stopX) { leapX = stopX; }
                    this.resCarouselInner.scrollLeft = Math.round(leapX);
                    if (leapX === stopX) {return}
                  }, i);
              }
          } else {
              for (let i = 0; i <= speed; i += rol) {
                setTimeout(() => {
                    leapX -= addr
                    //console.log(i);
                    if (Math.round(leapX) - 5 >= stopX) { leapX = stopX; }
                    this.resCarouselInner.scrollLeft = Math.round(leapX);
                    if (leapX === stopX) {return}
                  }, i);
              }
          }
    }

    private resCarouselAnimator( direction: number, start: number, end: number, speed: number, length: number) {
        let val = length < 5 ? length : 5;
            val = val === 1 ? 3 : val;

        if (direction === 1) {
          for (let i = start - 1; i < end; i++) {
              val = val * 2;
              this.resCarouselItems[i].style.transform = 'translateX(' + val + 'px)';
          }
        } else {
          for (let i = end - 1; i >= start - 1; i--) {
              val = val * 2;
               this.resCarouselItems[i].style.transform = 'translateX(-' + val + 'px)';
          }
        }
        setTimeout(() => {
          for (let i = start - 1; i < end; i++) {
            this.resCarouselItems[i].style.transform = 'translateX(0px)';
          }
        }, speed - 70);
    }

}
