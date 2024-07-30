import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-simpleVoting',
  templateUrl: './simpleVoting.component.html',
  styleUrls: ['./simpleVoting.component.css'],
})
export class SimpleVotingComponent implements OnInit {
  selected = 0;
  cardPoint = output<number>();
  constructor() {}

  ngOnInit() {}

  selectTshirt(select: number, totalPoints: number) {
    this.selected = select;
    this.cardPoint.emit(totalPoints);
  }
}
