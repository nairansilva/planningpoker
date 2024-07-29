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
  idVoting = '';

  showTotal = false;

  functionalityPoint = -1;
  integrationPoint = -1;
  tecnologyPoint = -1;
  riskPoint = -1;
  scopePoint = -1;
  experiencePoint = -1;
  dependencePoint = -1;
  testPoint = -1;

  getRecordById: Subscription;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private router: Router,
    private poNotificationService: PoNotificationService
  ) {
    this.poNotificationService.setDefaultDuration(3000);
    if (this.utilsService.getUser() == '') {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.getRecordById) {
      this.getRecordById.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.type = params['type'];
    });

    this.initializeVotes();
  }

  initializeVotes() {
    if (this.type === '1') {
      this.getRecordById = this.firestoreService
        .getRecordById('planning', this.id)
        .subscribe({
          next: (res) => {
            if (!this.startOpen) {
              this.refreshVotes(res);
            } else {
              this.inicializeVoting(res);
            }
          },
        });
    }
  }

  refreshVotes(res: any) {
    if (
      this.resetVotes.seconds != res.finish.seconds &&
      this.resetVotes.nanoseconds != res.finish.nanoseconds
    ) {
      this.prepareResetVotes(res);
    }

    if (
      this.refreshTime.seconds != res.refresh.seconds &&
      this.refreshTime.nanoseconds != res.refresh.nanoseconds
    ) {
      this.prepareRefreshTime();
    }
  }

  prepareResetVotes(res: any) {
    this.resetForm();
    this.showTotal = false;
    this.firestoreService
      .updateDoc(
        'planningVotes',
        this.id + this.utilsService.getUser(),
        this.generateFormVoting()
      )
      .then();
    this.poModal.close();
    this.resetVotes = res.finish;
    this.refreshTime = res.refresh;
    this.changeTshirt = res.tshirt;
    this.poNotificationService.success('Votação Reiniciada');
    this.poStepperComponent.first();
  }

  prepareRefreshTime() {
    this.poNotificationService.success('Pontuação Atual');
    this.showTotal = true;
    this.poModal.open();
  }

  showPoints() {
    this.firestoreService
      .updateDoc('planning', this.id, { refresh: new Date() })
      .then(() => this.poNotificationService.success('Apresentação Realizada'));
  }

  finish() {
    this.firestoreService
      .updateDoc('planning', this.id, { finish: new Date() })
      .then();

    this.poNotificationService.success('Votação Reiniciada');
  }

  inicializeVoting(res: any) {
    this.startOpen = false;
    this.resetVotes = res.finish;
    this.refreshTime = res.refresh;
    this.changeTshirt = res.tshirt;

    this.idVoting = this.id + this.utilsService.getUser();
    this.firestoreService.addDocumentWithID(
      'planningVotes',
      this.idVoting,
      this.generateFormVoting()
    );
  }

  updatePoints() {
    this.firestoreService
      .updateDoc('planningVotes', this.idVoting, this.generateFormVoting())
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

  resetForm() {
    this.functionalityPoint = -1;
    this.integrationPoint = -1;
    this.tecnologyPoint = -1;
    this.riskPoint = -1;
    this.scopePoint = -1;
    this.experiencePoint = -1;
    this.dependencePoint = -1;
    this.testPoint = -1;
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
