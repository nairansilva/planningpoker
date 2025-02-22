import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
} from '@angular/core';
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
  @Input() isAdmin = true;
  @Input() type = '2';

  columns: PoTableColumn[];
  items: any;
  totalVotes = 0;
  totalPoints = 0;
  tshirt = 'P';
  midPoints = 0;
  disabledDelete = true;

  getRecordByIdStartWith: Subscription;
  totalVotingPoints = {
    functionalityPoint: [0],
    integrationPoint: [0],
    tecnologyPoint: [0],
    riskPoint: [0],
    scopePoint: [0],
    experiencePoint: [0],
    dependencePoint: [0],
    testPoint: [0],
  };

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.startDetails();
    if (this.type == '2') {
      this.columns = this.buildColumnsDetails();
    } else {
      this.columns = this.buildColumnsSimple();
    }
  }

  startDetails() {
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
    this.totalVotingPoints = {
      functionalityPoint: [-1],
      integrationPoint: [-1],
      tecnologyPoint: [-1],
      riskPoint: [-1],
      scopePoint: [-1],
      experiencePoint: [-1],
      dependencePoint: [-1],
      testPoint: [-1],
    };

    let total = 0;
    points.map((point: VotingPointsInterface) => {
      this.totalVotingPoints.functionalityPoint.push(point.functionalityPoint);
      this.totalVotingPoints.integrationPoint.push(point.integrationPoint);
      this.totalVotingPoints.tecnologyPoint.push(point.tecnologyPoint);
      this.totalVotingPoints.riskPoint.push(point.riskPoint);
      this.totalVotingPoints.scopePoint.push(point.scopePoint);
      this.totalVotingPoints.experiencePoint.push(point.experiencePoint);
      this.totalVotingPoints.dependencePoint.push(point.dependencePoint);
      this.totalVotingPoints.testPoint.push(point.testPoint);

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
      this.totalVotingPoints.dependencePoint
    );
    this.totalPoints += this.mostCommonValue(
      this.totalVotingPoints.functionalityPoint
    );
    this.totalPoints += this.mostCommonValue(
      this.totalVotingPoints.tecnologyPoint
    );
    this.totalPoints += this.mostCommonValue(this.totalVotingPoints.riskPoint);
    this.totalPoints += this.mostCommonValue(this.totalVotingPoints.scopePoint);
    this.totalPoints += this.mostCommonValue(
      this.totalVotingPoints.experiencePoint
    );
    this.totalPoints += this.mostCommonValue(this.totalVotingPoints.testPoint);
    this.totalPoints += this.mostCommonValue(
      this.totalVotingPoints.integrationPoint
    );

    this.midPoints = Math.trunc(total / this.totalVotes);

    this.tshirt = this.calcTshirt(this.totalPoints);

    if (this.type == '1') {
      this.tshirt = this.calcTshirt(total / this.totalVotes);
    }
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

  buildColumnsDetails() {
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
            disabled: this.validDisableIcons.bind(this),
            tooltip: 'Deletar',
            value: 'delet',
          },
        ],
      },
    ]);
  }

  buildColumnsSimple() {
    return (this.columns = [
      { property: 'id', visible: false },
      { property: 'name', type: 'string', label: 'Paticipante', width: '8%' },
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
            disabled: this.validDisableIcons.bind(this),
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

  validDisableIcons() {
    return !this.isAdmin;
  }
}
