import { Component, OnInit, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

interface FormService {
  form: FormGroup;

  patch(value: any): void;
}

interface OrderingMethod {
  field: string;
  name: string;
}

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
  imports: [MatIcon, MatMenu, MatMenuTrigger, MatButton, NgClass, MatMenuItem],
})
export class SortingComponent implements OnInit {
  formServices = input<FormService[]>();

  orderingMethods = input<OrderingMethod[]>();

  readonly reordered = output<void>();

  selected = '';
  order = 'asc';

  constructor() {}

  ngOnInit(): void {
    this.orderingMethods().forEach((method) => {
      if (this.formServices().filter((fs) => fs.form.value.ordering === method.field).length > 0) {
        this.selected = method.name;
        this.order = 'asc';
      } else if (this.formServices().filter((fs) => fs.form.value.ordering === '-' + method.field).length > 0) {
        this.selected = method.name;
        this.order = 'desc';
      }
    });
  }

  ordering(method: OrderingMethod): void {
    this.selected = method.name;
    if (this.formServices()[0].form.value.ordering === method.field) {
      this.formServices().forEach((formService) => formService.patch({ ordering: '-' + method.field }));
      this.order = 'desc';
    } else {
      this.formServices().forEach((formService) => formService.patch({ ordering: method.field }));
      this.order = 'asc';
    }

    this.reordered.emit();
  }
}
