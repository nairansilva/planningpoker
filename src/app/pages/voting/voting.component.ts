import { UtilsService } from './../../shared/services/utils.service';
import { VotingPointsInterface } from './shared/interfaces/voting.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from './../../shared/services/fire-store.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  PoStepperComponent,
  PoTableColumn,
  PoNotificationService,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit, OnDestroy {
  @ViewChild(PoStepperComponent) poStepperComponent: PoStepperComponent;

  id: string;
  type: string;
  resetVotes: Date;
  refreshTime: Date;
  startOpen = true;
  idVotting = '';

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

  functionalityPoint = -1;
  integrationPoint = -1;
  tecnologyPoint = -1;
  riskPoint = -1;
  scopePoint = -1;
  experiencePoint = -1;
  dependencePoint = -1;
  testPoint = -1;

  getRecordByIdStartWith: Subscription;
  getRecordById: Subscription;

  columns: PoTableColumn[];
  items: any;
  totalVotes = 0;
  totalPoints = 0;
  tshirt = 'P';
  midPoints = 0;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router,
    private poNotificationService: PoNotificationService
  ) {
    if (this.utilsService.getUser() == '') {
      this.router.navigate(['/login']);
    }
    console.log(this.utilsService.getUser());
    this.columns = this.buildColumns();
  }
  ngOnDestroy(): void {
    if (this.getRecordByIdStartWith) {
      this.getRecordByIdStartWith.unsubscribe();
    }
    if (this.getRecordById) {
      this.getRecordById.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.type = params['type'];
    });

    if (this.type === '2') {
      this.startAdmin();
    } else {
      this.getRecordById = this.firestoreService
        .getRecordById('planning', this.id)
        .subscribe({
          next: (res) => {
            if (!this.startOpen) {
              if (this.resetVotes != res.resetVotes) {
                this.poStepperComponent.first();
              }

              if (this.refreshTime != res.refresh) {
                this.updatePoints();
                this.poNotificationService.success('Votação Resetada');
              }
            } else {
              this.startOpen = false;
              this.resetVotes = res.resetVotes;
              this.refreshTime = res.refresh;
              this.inicializeVotting();
            }
          },
        });
    }
  }

  startAdmin() {
    this.getRecordByIdStartWith = this.firestoreService
      .getRecordByIdStartWith('planningVotes', this.id)
      .subscribe({
        next: (res) => {
          this.items = [];
          res.map((vote: any) => {
            vote.name = vote.id.substr(this.id.length, vote.id.length);
            vote.icons = ['delet'];
            this.items = this.items.concat(vote);
          });

          this.totalVotes = res.length;
          this.calPlanning(res);
        },
      });
  }

  totalize() {
    this.firestoreService
      .updateDoc('planning', this.id, { tshirt: this.tshirt })
      .then();
  }

  finish() {
    const restForm = {
      functionalityPoint: -1,
      integrationPoint: -1,
      tecnologyPoint: -1,
      riskPoint: -1,
      scopePoint: -1,
      experiencePoint: -1,
      dependencePoint: -1,
      testPoint: -1,
    };

    this.firestoreService
      .updateDoc('planning', this.id, { finish: new Date() })
      .then();

    this.items.map((item: any) => {
      this.firestoreService.updateDoc('planningVotes', item.id, restForm);
    });
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
      tecnologyPoint: this.tecnologyPoint,
      riskPoint: this.riskPoint,
      scopePoint: this.scopePoint,
      experiencePoint: this.experiencePoint,
      dependencePoint: this.dependencePoint,
      testPoint: this.testPoint,
    };
  }

  buildColumns() {
    return (this.columns = [
      { property: 'id' },
      { property: 'name', type: 'string', label: 'Paticipante', width: '8%' },
      { property: 'functionalityPoint', label: 'Funcionalidade' },
      { property: 'integrationPoint', label: 'Integração' },
      { property: 'tecnologyPoint', label: 'Tecnologia' },
      { property: 'riskPoint', label: 'Risco' },
      { property: 'scopePoint', label: 'Escopo' },
      { property: 'experiencePoint', label: 'Experiência' },
      { property: 'dependencePoint', label: 'Dependência' },
      { property: 'testPoint', label: 'Testes' },

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

  canActiveNextStep(value: string): boolean {
    return eval('this.' + value) >= 0;
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

    if (this.totalPoints <= 8) {
      this.tshirt = 'P';
    } else if (this.totalPoints <= 15) {
      this.tshirt = 'M';
    } else {
      this.tshirt = 'G';
    }
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

  receiveFunctionalityPoint(point: any) {
    this.functionalityPoint = point;
    this.poStepperComponent.next();
  }

  receiveIntegrationPoint(point: any) {
    this.integrationPoint = point;
    this.poStepperComponent.next();
  }

  receiveTecnologyPoint(point: any) {
    this.tecnologyPoint = point;
    this.poStepperComponent.next();
  }

  receiveRiskPoint(point: any) {
    this.riskPoint = point;
    this.poStepperComponent.next();
  }

  receiveScopePoint(point: any) {
    this.scopePoint = point;
    this.poStepperComponent.next();
  }

  receiveExperiencePoint(point: any) {
    this.experiencePoint = point;
    this.poStepperComponent.next();
  }

  receiveDependencePoint(point: any) {
    this.dependencePoint = point;
    this.poStepperComponent.next();
  }

  receiveTestPoint(point: any) {
    this.testPoint = point;
    this.updatePoints();
    this.poNotificationService.success('Votos Computados');
  }

  deleteVote(line: any) {
    this.firestoreService.deleteDoc('planningVotes', line.id).then();
  }
}
