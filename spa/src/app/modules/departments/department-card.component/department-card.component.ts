import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Department } from '@api/defs/Department';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'department-card',
  imports: [MatCardModule, MatIcon],
  templateUrl: './department-card.component.html',
  styleUrl: './department-card.component.css'
})
export class DepartmentCardComponent { 

  department = input.required<Department>()
}
