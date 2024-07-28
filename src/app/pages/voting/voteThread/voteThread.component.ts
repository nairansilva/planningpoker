import { Component, EventEmitter, Input, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-voteThread',
  templateUrl: './voteThread.component.html',
  styleUrls: ['./voteThread.component.css'],
})
export class VoteThreadComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() pointDescription: any[] = [{ point: '' }];
  point = [false, false, false];

  cardPoint = output<number>();

  constructor() {}

  ngOnInit() {}

  selectPoint(points: any, card: number) {
    this.point = points;
    this.cardPoint.emit(card);
  }
}
