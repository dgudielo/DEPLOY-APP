import { Injectable } from '@angular/core';
import { LoginService } from '../user-perfil/login.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanySelectService {
  currentCompany: string[];
  private _selectedItemSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedItem$ = this._selectedItemSubject.asObservable();

  constructor(
    public loginService: LoginService,
  ) { }

  company(): string[] {
    this.currentCompany = this.loginService.currentUserValue.cod_compania;
    return this.currentCompany;
  }

  setSelectedItem(selectedItem: string): void {
    this._selectedItemSubject.next(selectedItem);
  }

  getCompany(){
    console.log(this._selectedItemSubject.value);
  }

}
