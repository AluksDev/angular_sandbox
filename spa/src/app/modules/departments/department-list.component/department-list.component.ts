import { Component, inject, OnInit, signal } from '@angular/core';
import { DepartmentService } from '../department.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DepartmentCardComponent } from "../department-card.component/department-card.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, shareReplay, tap } from 'rxjs';
import { AlphaShortPipe } from '@utils/pipe/alpha-short.pipe';
import { Router } from '@angular/router';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { DepartmentDialogComponent } from '../department-dialog.component/department-dialog.component';


/**
 * @title Department List Component
 * @description Manages the display and filtering logic for the department list, 
 * including responsive grid layout and asynchronous search.
 */
@Component({
  selector: 'department-list',
  imports: [DepartmentCardComponent,
    ReactiveFormsModule,
    AlphaShortPipe,
    MatGridList,
    MatGridTile,
    AsyncPipe, MatIcon],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit { 

  private _router = inject(Router);
  private _brObserver = inject(BreakpointObserver);
  departmentService = inject(DepartmentService);
  cols$: Observable<number>;
  
  departmentResource = rxResource({
    request: () => ({ searchQuery: this.searchQuery()}),
    loader: ({request}) => {
      return this.departmentService.getDepartments(request.searchQuery);
    }
  });

  searchControl = new FormControl('');
  searchQuery = signal('');
  ascendentShort = signal<boolean>(true);
  breakpoint$: Observable<number>
  
  private _dialog = inject(MatDialog);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged() 
      )
      .subscribe(newValue => {
        this.searchQuery.set(newValue);
      });

    this.breakpoint$ = this._brObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
    ])
    .pipe(
      map(result => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) return 1;
          if (result.breakpoints[Breakpoints.Small]) return 2;
          if (result.breakpoints[Breakpoints.Medium]) return 3;
          if (result.breakpoints[Breakpoints.Large]) return 4;
        }
        return 4;
      }),
      shareReplay()
    );
  }

  navigateToDetails( id: number){
    this._router.navigate(["departments/department", id]);
  }

  toggleAscendent(){
    this.ascendentShort.update(value => !value);
  }

  openDialog(): void{
    this._dialog.open(DepartmentDialogComponent, {
      width: '350px',
      data: { 
        mode: 'create',
      }
    });
  }

}
