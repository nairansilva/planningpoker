import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  output,
} from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-voteThread',
  templateUrl: './voteThread.component.html',
  styleUrls: ['./voteThread.component.css'],
})
export class VoteThreadComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() pointDescription: any[] = [{ point: '' }];
  @ViewChild('detailsModal', { static: true })
  detailsModalElement: PoModalComponent;
  styleCard = 'po-lg-4 po-mt-2';

  point = [];
  selected = '-1';

  cardPoint = output<number>();

  constructor() {}

  ngOnInit() {
    if (this.pointDescription.length > 3) {
      this.styleCard = 'po-lg-3 po-mt-2';
    }
  }

  selectPoint(card: string) {
    this.selected = card;
    this.cardPoint.emit(parseInt(card));
  }

  showDetailModal(item: any) {
    this.detailsModalElement.open();
  }
}
