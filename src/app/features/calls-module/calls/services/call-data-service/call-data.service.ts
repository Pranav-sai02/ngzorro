import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Call } from '../../models/Cases';

/**
 * Manages the currently selected call across components using a BehaviorSubject.
 */
@Injectable({
  providedIn: 'root'
})
export class CallDataService {

  // Holds the currently selected call (null if none)
  private selectedCallSubject = new BehaviorSubject<Call | null>(null);

  // Observable for components to subscribe to call changes
  selectedCall$ = this.selectedCallSubject.asObservable();

  // Set a new selected call
  setSelectedCall(call: Call): void {
    this.selectedCallSubject.next(call);
  }

  // Clear the current selected call
  clearSelectedCall(): void {
    this.selectedCallSubject.next(null);
  }

  // Get the currently selected call value (synchronously)
  getSelectedCall(): Call | null {
    return this.selectedCallSubject.value;
  }
}
