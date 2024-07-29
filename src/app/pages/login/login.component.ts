import { UtilsService } from './../../shared/services/utils.service';
import { FirestoreService } from './../../shared/services/fire-store.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoSelectOption } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  rooms: Array<PoSelectOption> = [];

  constructor(
    private fb: FormBuilder,
    private poNotificationService: PoNotificationService,
    private firestoreService: FirestoreService,
    private router: Router,
    private utilsService: UtilsService
  ) {
    this.loginForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      room: ['', Validators.required],
      person: ['', Validators.required],
    });
    this.getItems();
  }

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.utilsService.setUser(this.loginForm.value['name']);
      this.router.navigate([
        '/voting',
        this.loginForm.value['room'],
        this.loginForm.value['person'],
      ]);
    } else {
      this.poNotificationService.warning('Informe o nome de usuário e senha');
    }
  }

  getItems() {
    const finalFilter = [
      {
        field: 'status',
        filter: 1,
        operator: '==',
      },
    ];
    this.firestoreService
      .getFilteredRecords('planning', finalFilter)
      .subscribe((data) => {
        this.rooms = [];
        data.map((plannings) => {
          this.rooms = this.rooms.concat({
            label: plannings.name,
            value: plannings.id,
          });
        });
      });
  }
}
