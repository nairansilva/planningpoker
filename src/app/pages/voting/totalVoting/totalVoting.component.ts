import { Component, Input, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { FirestoreService } from '../../../shared/services/fire-store.service';
import { Subscription } from 'rxjs';
import { VotingPointsInterface } from '../shared/interfaces/voting.model';

@Component({
  selector: 'app-totalVoting',
  templateUrl: './totalVoting.component.html',
  styleUrls: ['./totalVoting.component.css'],
})
export class TotalVotingComponent implements OnInit {
  @Input() id = '';

  columns: PoTableColumn[];
  items: any;
  totalVotes = 0;
  totalPoints = 0;
  tshirt = 'P';
  midPoints = 0;

  getRecordByIdStartWith: Subscription;
  totalVottingPoints = {
    functionalityPoint: [0],
    integrationPoint: [0],
    tecnologyPoint: [0],
    riskPoint: [0],
    scopePoint: [0],
    experiencePoint: [0],
    dependencePoint: [0],
    testPoint: [0],
  };

  constructor(private firestoreService: FirestoreService) {
    this.columns = this.buildColumns();
  }

  ngOnInit() {
    this.startAdmin();
  }

  startAdmin() {
    this.getRecordByIdStartWith = this.firestoreService
      .getRecordByIdStartWith('planningVotes', this.id)
      .subscribe({
        next: (res) => {
          this.items = [];
          res.map((vote: any) => {
            let totalPointsUser = 0;

            vote.name = vote.id.substr(this.id.length, vote.id.length);
            vote.icons = ['delet'];

            totalPointsUser += vote.functionalityPoint;
            totalPointsUser += vote.integrationPoint;
            totalPointsUser += vote.tecnologyPoint;
            totalPointsUser += vote.riskPoint;
            totalPointsUser += vote.scopePoint;
            totalPointsUser += vote.experiencePoint;
            totalPointsUser += vote.dependencePoint;
            totalPointsUser += vote.testPoint;

            vote.totalPoints = totalPointsUser;
            vote.tshirt = this.calcTshirt(totalPointsUser);
            this.items = this.items.concat(vote);
          });

          this.totalVotes = res.length;
          this.calPlanning(res);
        },
      });
  }

  calPlanning(points: any) {
    // (Object.keys(this.totalVottingPoints) as Array<keyof VotingPoints>).forEach(
    //   (prop) => {
    //     this.totalVottingPoints[prop] = 0;
    //   }
    // );

    this.totalVottingPoints = {
      functionalityPoint: [-1],
      integrationPoint: [-1],
      tecnologyPoint: [-1],
      riskPoint: [-1],
      scopePoint: [-1],
      experiencePoint: [-1],
      dependencePoint: [-1],
      testPoint: [-1],
    };

    console.log(points);
    console.log('Troquei os números');

    let total = 0;
    points.map((point: VotingPointsInterface) => {
      this.totalVottingPoints.functionalityPoint.push(point.functionalityPoint);
      this.totalVottingPoints.integrationPoint.push(point.integrationPoint);
      this.totalVottingPoints.tecnologyPoint.push(point.tecnologyPoint);
      this.totalVottingPoints.riskPoint.push(point.riskPoint);
      this.totalVottingPoints.scopePoint.push(point.scopePoint);
      this.totalVottingPoints.experiencePoint.push(point.experiencePoint);
      this.totalVottingPoints.dependencePoint.push(point.dependencePoint);
      this.totalVottingPoints.testPoint.push(point.testPoint);

      total += point.dependencePoint;
      total += point.integrationPoint;
      total += point.functionalityPoint;
      total += point.tecnologyPoint;
      total += point.riskPoint;
      total += point.scopePoint;
      total += point.experiencePoint;
      total += point.testPoint;
    });

    this.totalPoints = 0;
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.dependencePoint
    );
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.functionalityPoint
    );
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.tecnologyPoint
    );
    this.totalPoints += this.mostCommonValue(this.totalVottingPoints.riskPoint);
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.scopePoint
    );
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.experiencePoint
    );
    this.totalPoints += this.mostCommonValue(this.totalVottingPoints.testPoint);
    this.totalPoints += this.mostCommonValue(
      this.totalVottingPoints.integrationPoint
    );

    this.midPoints = Math.trunc(total / this.totalVotes);

    this.tshirt = this.calcTshirt(this.totalPoints);
  }

  calcTshirt(total: number): string {
    let size = '';
    if (total <= 8) {
      size = 'P';
    } else if (total <= 15) {
      size = 'M';
    } else {
      size = 'G';
    }

    return size;
  }

  mostCommonValue(arr: any): number {
    const counts = arr.reduce(
      (acc: { [x: string]: any }, num: string | number) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      },
      {} as { [key: number]: number }
    );

    return Object.keys(counts).reduce((mostCommon, num) => {
      if (counts[Number(num)] > counts[mostCommon]) {
        return Number(num);
      } else if (counts[Number(num)] === counts[mostCommon]) {
        return Math.max(Number(num), mostCommon);
      } else {
        return mostCommon;
      }
    }, Number(Object.keys(counts)[0]));
  }

  buildColumns() {
    return (this.columns = [
      { property: 'id', visible: false },
      { property: 'name', type: 'string', label: 'Paticipante', width: '8%' },
      { property: 'functionalityPoint', label: 'Funcionalidade' },
      { property: 'integrationPoint', label: 'Integração' },
      { property: 'tecnologyPoint', label: 'Tecnologia' },
      { property: 'riskPoint', label: 'Risco' },
      { property: 'scopePoint', label: 'Escopo' },
      { property: 'experiencePoint', label: 'Experiência' },
      { property: 'dependencePoint', label: 'Dependência' },
      { property: 'testPoint', label: 'Testes' },
      { property: 'totalPoints', label: 'Total' },
      { property: 'tshirt', label: 'Camisa' },

      {
        property: 'icons',
        label: 'Ações',
        type: 'icon',
        sortable: false,
        icons: [
          {
            action: this.deleteVote.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Deletar',
            value: 'delet',
          },
        ],
      },
    ]);
  }

  deleteVote(line: any) {
    this.firestoreService.deleteDoc('planningVotes', line.id).then();
  }
}
