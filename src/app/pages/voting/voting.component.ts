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
  PoModalComponent,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit, OnDestroy {
  @ViewChild(PoStepperComponent) poStepperComponent: PoStepperComponent;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  id: string;
  type: string;
  resetVotes: any;
  refreshTime: any;
  changeTshirt: string = '';
  startOpen = true;
  idVotting = '';

  showTotal = false;
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

    if (this.type === '1') {
      this.getRecordById = this.firestoreService
        .getRecordById('planning', this.id)
        .subscribe({
          next: (res) => {
            if (!this.startOpen) {
              if (
                this.resetVotes.seconds != res.finish.seconds &&
                this.resetVotes.nanoseconds != res.finish.nanoseconds
              ) {
                this.functionalityPoint = -1;
                this.integrationPoint = -1;
                this.tecnologyPoint = -1;
                this.riskPoint = -1;
                this.scopePoint = -1;
                this.experiencePoint = -1;
                this.dependencePoint = -1;
                this.testPoint = -1;
                this.poModal.close();
                this.showTotal = false;
                this.poStepperComponent.first();
              }

              if (
                this.refreshTime.seconds != res.refresh.seconds &&
                this.refreshTime.nanoseconds != res.refresh.nanoseconds
              ) {
                this.poNotificationService.success('Pontuação Atual');
                this.showTotal = true;
                this.poModal.open();
              }
            } else {
              this.startOpen = false;
              this.resetVotes = res.finish;
              this.refreshTime = res.refresh;
              this.changeTshirt = res.tshirt;
              this.inicializeVotting();
            }
          },
        });
    }
  }

  showPoints() {
    console.log(this.items);
    this.firestoreService
      .updateDoc('planning', this.id, { refresh: new Date() })
      .then(() => this.poNotificationService.success('Apresentação Realizada'));
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

  canActiveNextStep(value: string): boolean {
    return eval('this.' + value) >= 0;
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
