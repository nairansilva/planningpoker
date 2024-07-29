import { UtilsService } from './../../shared/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from './../../shared/services/fire-store.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoStepperComponent, PoTableColumn } from '@po-ui/ng-components';

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

  functionalityPoint = 0;
  integrationPoint = 0;
  tecnologyPoint = 0;
  riskPoint = 0;
  scopePoint = 0;
  experiencePoint = 0;
  dependencePoint = 0;
  testPoint = 0;

  getRecordByIdStartWith: Subscription;
  getRecordById: Subscription;

  columns: PoTableColumn[];
  items: any;
  totalVotes = 0;
  totalPoints = 0;
  tshirt = 'P';

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router
  ) {
    if (this.utilsService.getUser() == '') {
      this.router.navigate(['/login']);
    }
    console.log(this.utilsService.getUser());
    this.columns = this.buildColumns();
  }
  ngOnDestroy(): void {
    this.getRecordByIdStartWith.unsubscribe();
    this.getRecordById.unsubscribe();
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

              if ((this.refreshTime = res.refresh)) {
                this.updatePoints();
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
          console.log(res);
        },
      });
  }

  totalize() {
    this.firestoreService
      .updateDoc('planning', this.id, { refresh: new Date() })
      .then();
  }

  caltTotal() {
    this.firestoreService
      .updateDoc('planning', this.id, { finish: new Date() })
      .then();
  }

  finish() {
    console.log(this.items);
    const restForm = {
      functionalityPoint: 0,
      integrationPoint: 0,
      tecnologyPoint: 0,
      riskPoint: 0,
      scopePoint: 0,
      experiencePoint: 0,
      dependencePoint: 0,
      testPoint: 0,
    };
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
      { property: 'name', type: 'string', label: 'name', width: '8%' },
      { property: 'functionalityPoint', label: 'Funcionalidade' },
      { property: 'tecnologyPoint', label: 'Tecnologia' },
      { property: 'riskPoint', label: 'Risco' },
      { property: 'scopePoint', label: 'Escopo' },
      { property: 'experiencePoint', label: 'Experiência' },
      { property: 'dependencePoint', label: 'Dependência' },
      { property: 'testPoint', label: 'Testes' },
      {
        property: 'icons',
        label: 'Actions',
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
  }

  deleteVote(line: any) {
    this.firestoreService.deleteDoc('planningVotes', line.id).then();
  }
}
