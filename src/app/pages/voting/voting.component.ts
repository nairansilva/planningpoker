import { UtilsService } from './../../shared/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from './../../shared/services/fire-store.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit {
  id: string;
  type: string;
  finishTime: Date;
  refreshTime: Date;
  startOpen = true;
  idVotting = '';

  functionalityPoint = 0;
  integrationPoint = 0;

  calcVotes: Subscription;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    console.log(this.utilsService.getUser());
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.type = params['type'];
    });

    this.calcVotes = this.firestoreService
      .getRecordByIdStartWith('planningVotes', this.id)
      .subscribe({
        next: (res) => console.log('total', res),
      });

    this.firestoreService.getRecordById('planning', this.id).subscribe({
      next: (res) => {
        if (!this.startOpen) {
          if (this.finishTime != res.finish) {
          }
          if ((this.refreshTime = res.refresh)) {
            this.updatePoints();
          }
        } else {
          this.startOpen = false;
          this.finishTime = res.finish;
          this.refreshTime = res.refresh;
          this.inicializeVotting();
        }
      },
    });
  }

  receiveFunctionalityPoint(point: any) {
    this.functionalityPoint = point;
  }

  receiveIntegrationPoint(point: any) {
    this.integrationPoint = point;
  }

  totalize() {
    this.firestoreService
      .updateDoc('planning', this.id, { refresh: new Date() })
      .then();
  }

  finish() {
    this.firestoreService
      .updateDoc('planning', this.id, { finish: new Date() })
      .then();
  }

  inicializeVotting() {
    this.idVotting = this.id + this.utilsService.getUser();
    this.firestoreService.addDocumentWithID(
      'planningVotes',
      this.idVotting,
      this.generateFormVoting()
    );
  }

  updatePoints() {
    this.firestoreService
      .updateDoc('planningVotes', this.idVotting, this.generateFormVoting())
      .then();
  }

  generateFormVoting() {
    return {
      functionalityPoint: this.functionalityPoint,
      integrationPoint: this.integrationPoint,
    };
  }
}
