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
  point = [];
  selected = -1;

  cardPoint = output<number>();

  constructor() {}

  ngOnInit() {}

  selectPoint(card: number) {
    this.selected = card;
    this.cardPoint.emit(card);
  }
}
