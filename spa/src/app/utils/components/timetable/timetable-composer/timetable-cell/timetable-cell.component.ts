import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { StriptagsPipe } from '@fuse/pipes/striptags';

@Component({
  selector: 'app-timetable-cell',
  templateUrl: './timetable-cell.component.html',
  styleUrls: ['./timetable-cell.component.scss'],

  imports: [MatIconModule, CommonModule, MatButtonModule, MatMenuModule, StriptagsPipe],
})
export class TimetableCellComponent {
  // Input variables
  text = input<string>();
  subtext = input<string>();
  role = input<string>();
  first = input<boolean>();
  last = input<boolean>();
  isFirstLink = input<boolean>();
  isBelow = input<boolean>();
  linksData = input<{}>();
  enableEdit = input<boolean>();
  enableLink = input(true);

  // Events for hovering effects
  readonly upToggle = output<boolean>();
  readonly downToggle = output<boolean>();
  readonly deleteToggle = output<boolean>();

  // Events for buttons
  readonly moveup = output<string>();
  readonly movedown = output<string>();
  readonly addup = output<string>();
  readonly adddown = output<string>();
  readonly edit = output<string>();
  readonly remove = output<string>();
  readonly link = output<Object>();
  readonly unlink = output<Object>();
  readonly clone = output<Object>();

  // Variables for hovering effects
  hoverUp = false;
  hoverDown = false;

  // Timer for delay animation feedback and improve UX
  timer: any;

  constructor() {}

  onMoveUp(): void {
    this.moveup.emit('');
  }

  onMoveDown(): void {
    this.movedown.emit('');
  }

  onAddUp(): void {
    this.addup.emit('');
  }

  onAddDown(): void {
    this.adddown.emit('');
  }

  onEdit(): void {
    this.edit.emit('');
  }

  onUnlink(): void {
    this.unlink.emit('');
  }

  onClone(): void {
    this.clone.emit('');
  }

  onRemove(): void {
    this.remove.emit('');
  }

  onLinkElement(element): void {
    this.link.emit(element);
  }

  upEnter(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.upToggle.emit(true);
      this.hoverUp = true;
    }, 100);
  }

  upLeave(): void {
    clearTimeout(this.timer);
    this.upToggle.emit(false);
    this.hoverUp = false;
  }

  downEnter(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.downToggle.emit(true);
      this.hoverDown = true;
    }, 100);
  }

  downLeave(): void {
    clearTimeout(this.timer);
    this.downToggle.emit(false);
    this.hoverDown = false;
  }

  deleteEnter(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.deleteToggle.emit(true);
    }, 100);
  }

  deleteLeave(): void {
    clearTimeout(this.timer);
    this.deleteToggle.emit(false);
  }
}
