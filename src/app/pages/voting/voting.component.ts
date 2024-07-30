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
  isAdmin: boolean;
  resetVotes: any;
  refreshTime: any;
  changeTshirt: string = '';
  startOpen = true;
  idVoting = '';

  showTotal = false;

  functionalityPoint = 0;
  integrationPoint = 0;
  tecnologyPoint = 0;
  riskPoint = 0;
  scopePoint = 0;
  experiencePoint = 0;
  dependencePoint = 0;
  testPoint = 0;

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

      if (this.utilsService.getUser().toLocaleLowerCase() === 'admin') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });

    this.initializeVotes();
  }

  initializeVotes() {
    if (!this.isAdmin) {
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
    this.functionalityPoint = 0;
    this.integrationPoint = 0;
    this.tecnologyPoint = 0;
    this.riskPoint = 0;
    this.scopePoint = 0;
    this.experiencePoint = 0;
    this.dependencePoint = 0;
    this.testPoint = 0;
  }

  canActiveNextStep(value: string): boolean {
    return eval('this.' + value) >= 0;
  }

  receiveFunctionalityPoint(point: any) {
    this.functionalityPoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveIntegrationPoint(point: any) {
    this.integrationPoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveTecnologyPoint(point: any) {
    this.tecnologyPoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveRiskPoint(point: any) {
    this.riskPoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveScopePoint(point: any) {
    this.scopePoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveExperiencePoint(point: any) {
    this.experiencePoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
  }

  receiveDependencePoint(point: any) {
    this.dependencePoint = point;
    this.updatePoints();
    this.poStepperComponent.next();
    // this.poStepperComponent.next();
  }

  receiveTestPoint(point: any) {
    this.testPoint = point;
    this.updatePoints();
    this.poNotificationService.success('Votos Computados');
  }

  receiveSimpleVote(point: any) {
    this.functionalityPoint = point;
    this.updatePoints();
    this.poNotificationService.success('Votos Computados');
  }

  deleteVote(line: any) {
    this.firestoreService.deleteDoc('planningVotes', line.id).then();
  }
}
