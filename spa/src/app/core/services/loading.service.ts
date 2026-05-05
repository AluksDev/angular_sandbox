import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<number>(0);
    loading$ = this.loadingSubject.asObservable();

    show() {
        this.loadingSubject.next(this.loadingSubject.value + 1);
    }

    hide() {
        this.loadingSubject.next(this.loadingSubject.value - 1);
    }

    isLoading() {
        return this.loadingSubject.value > 0;
    }
}