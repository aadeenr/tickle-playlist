import { Component } from '@angular/core';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';

@Component({
    selector: 'mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss'],
    animations: [
        trigger('hideAnimation', [
            state('visible', style({
                top: '0',
            })),
            state('hidden', style({
                top: '-100%',
            })),
            transition('visible => hidden', animate('1000ms ease-in')),
        ]),
    ]
})

export class MobileComponent {
	constructor() {}
    state: string = 'visible';

    hide() {
        this.state = (this.state === 'visible' ? 'hidden' : 'visible');
    }
}
