import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoSelectOption } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private poNotificationService: PoNotificationService
  ) {
    this.loginForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      room: ['', Validators.required],
    });
  }

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
    } else {
      this.poNotificationService.warning('Informe o nome de usuário e senha');
    }
  }
}
