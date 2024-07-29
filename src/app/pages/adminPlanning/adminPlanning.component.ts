import { FirestoreService } from './../../shared/services/fire-store.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  PoNotificationService,
  PoSelectOption,
  PoTableColumn,
  PoTagType,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-adminPlanning',
  templateUrl: './adminPlanning.component.html',
  styleUrls: ['./adminPlanning.component.css'],
})
export class AdminPlanningComponent implements OnInit {
  readonly squadNames: Array<PoSelectOption> = [
    { label: 'Componentes', value: 'DFRM1' },
    { label: 'License', value: 'DFRM2' },
    { label: 'Smart', value: 'DFRM3' },
    { label: 'Monitoramento', value: 'DFRM4' },
  ];
  adminForm: FormGroup;
  columns: PoTableColumn[];
  items: any;
  isLoadingTable = true;

  constructor(
    private fb: FormBuilder,
    private poNotificationService: PoNotificationService,
    private firestoreService: FirestoreService
  ) {
    this.adminForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      squad: ['', Validators.required],
      status: [1],
      date: [new Date()],
      refresh: [new Date()],
      finish: [new Date()],
      resetVotes: [new Date()],
    });
    this.buildColumns();
    this.getItems();
  }

  ngOnInit() {}

  buildColumns() {
    return (this.columns = [
      { property: 'id', type: 'string', label: 'ID', width: '8%' },
      { property: 'name', label: 'Nome' },
      { property: 'squad', label: 'Squad' },
      { property: 'dateFormated', label: 'Data de Criação' },
      {
        property: 'status',
        type: 'label',
        width: '8%',
        labels: [
          { value: 1, color: 'blue', label: 'Aberta' },
          { value: 2, label: 'Finalizada', color: 'green' },
        ],
      },
      {
        property: 'icons',
        label: 'Actions',
        type: 'icon',
        sortable: false,
        icons: [
          {
            action: this.editPlanning.bind(this),
            color: () => {},
            disabled: this.validDisableIcons.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'edit',
          },
          {
            action: this.deletePlanning.bind(this),
            disabled: this.validDisableIcons.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Deletar',
            value: 'delet',
          },
          {
            action: this.finishPlanning.bind(this),
            disabled: this.validDisableIcons.bind(this),
            icon: 'po-icon-ok',
            tooltip: 'Finalizar',
            value: 'finish',
          },
        ],
      },
    ]);
  }

  getItems() {
    this.firestoreService.getRecords('planning').subscribe((data) => {
      data.map((plannings) => {
        plannings.dateFormated = plannings.date.toDate().toLocaleDateString();
        plannings.icons = ['edit', 'delet', 'finish'];
      });
      console.log(data);
      this.items = data;
      this.isLoadingTable = false;
    });
  }

  newPlanning() {
    if (this.adminForm.valid) {
      if (this.adminForm.value['id']) {
        this.firestoreService
          .updateDoc(
            'planning',
            this.adminForm.value['id'],
            this.adminForm.value
          )
          .then(() => {
            this.poNotificationService.success('Registro criado com sucesso');
          });
      } else {
        this.firestoreService
          .createDoc('planning', this.adminForm.value)
          .then(() => {
            this.poNotificationService.success('Registro alterado com sucesso');
          });
      }
    }
  }

  validDisableIcons(line: any): boolean {
    return line.status == 2;
  }
  editPlanning(line: any) {
    this.adminForm.patchValue({
      id: line.id,
      squad: line.squad,
      name: line.name,
    });
  }

  deletePlanning(line: any) {
    this.firestoreService
      .deleteDoc('planning', line.id)
      .then(() =>
        this.poNotificationService.success('Planning Deletada com Sucesso')
      );
  }

  finishPlanning(line: any) {
    this.firestoreService
      .updateDoc('planning', line.id, { status: 2 })
      .then(() =>
        this.poNotificationService.success('Planning Finalizada com Sucesso')
      );
  }
}
