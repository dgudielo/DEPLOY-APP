import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }
}