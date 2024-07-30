import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private userName = '';
  constructor() {}

  setUser(user: string) {
    this.userName = user;
  }

  getUser(): string {
    return this.userName;
  }
}
