import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';
import { AsyncPipe } from '@angular/common';



export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  imports: [AsyncPipe],
  selector: 'breadcrumb-component',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

}