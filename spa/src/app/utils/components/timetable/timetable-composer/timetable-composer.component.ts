import { DomSanitizer } from '@angular/platform-browser';
import { EntityPreviewTimetableFormService } from '@api/forms/entity/previewTimetable/previewTimetable.service';
import { ChangeDetectorRef, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import _ from 'lodash';
import { Entity, Timetable } from '@api/model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { EntityReadFormService } from '@api/forms/entity/read/read.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EntityFormService } from '@modules/entity-base/form/entityFormService.type';
import { InfoDialogComponent } from '@fuse/components/dialogs/info/info.component';
import { EntitySelectComponent } from '@utils/components/entity-select/entity-select.component';
import { TimetableCellComponent } from '@utils/components/timetable/timetable-composer/timetable-cell/timetable-cell.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CleanDataService } from '@utils/clean-data.service';

import { TimetablePriceDialogComponent } from './timetable-price-dialog/timetable-price-dialog.component';
import { TimetableHourDialogComponent } from './timetable-hour-dialog/timetable-hour-dialog.component';
import { TimetablePeriodDialogComponent } from './timetable-period-dialog/timetable-period-dialog.component';
import { TimetableCommentDialogComponent } from './timetable-comment-dialog/timetable-comment-dialog.component';
import { TimetableDayDialogComponent } from './timetable-day-dialog/timetable-day-dialog.component';

export interface TimetableInfo {
  periods: PeriodInfo[];
}

export interface PeriodInfo {
  timetable_period: number;
  isFirstLink: boolean;
  isBelow: boolean;
  days: DayInfo[];
}

export interface DayInfo {
  timetable_day: number;
  isFirstLink: boolean;
  isBelow: boolean;
  hours: HourInfo[];
}

export interface HourInfo {
  timetable_hour: number;
  isFirstLink: boolean;
  isBelow: boolean;
  price: number;
  isFirstLinkPrice: boolean;
  isBelowPrice: boolean;
  comment: number;
  isFirstLinkComment: boolean;
  isBelowComment: boolean;
}

interface TimetableValue {
  data: {
    timetable: {
      periods: any[];
      timetable_days: any[];
      timetable_hours: any[];
      prices: any[];
      descriptions: any[];
      hide: boolean;
    };
  };
}

@Component({
  selector: 'app-timetable-composer',
  templateUrl: './timetable-composer.component.html',
  styleUrls: ['./timetable-composer.component.scss'],
  providers: [EntityReadFormService, EntityPreviewTimetableFormService],
  imports: [
    EntitySelectComponent,
    TimetableCellComponent,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class TimetableComposerComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  readFS = inject(EntityReadFormService);
  previewFS = inject(EntityPreviewTimetableFormService);
  private sanitizer = inject(DomSanitizer);

  timetableInput = input<Timetable>(); // Timetable data
  timetable = signal<Timetable>(undefined); // Timetable data
  formServiceInput = input<EntityFormService>(); // Associated form service
  formService = signal<EntityFormService>(undefined); // Associated form service

  // Form group shortcut (data.controls.timetable)
  form: FormGroup;

  // For hovering effects
  hovering: {
    [key: number]: {
      days: {
        [key: number]: {
          hours: {};
          up?: boolean;
          down?: boolean;
          none?: boolean;
        };
      };
      up?: boolean;
      down?: boolean;
      none?: boolean;
    };
  } = {};
  // Timetable data
  data: TimetableInfo;

  // Lookup tables
  periods = {};
  days = {};
  hours = {};
  prices = {};
  comments = {};

  snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    effect(() => {
      const formServiceLocal = this.formServiceInput();
      this.formService.set(formServiceLocal);
      this.ngOnInit();
    });
    effect(() => {
      const timetableLocal = this.timetableInput();
      this.timetable.set(timetableLocal);
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.formService.set(this.formServiceInput());
    this.form = this.formService().form.controls['data']['controls']['timetable'];
    this.prepareTimetableData();
    if (!this.timetable()) {
      setTimeout(() => this.form.patchValue({ hide: false }));
    }
  }

  /**
   * Initialize the timetable data structure with data from the server
   * In this process we transform the data coming from the server into the
   * data model needed by the timetable component
   */
  prepareTimetableData(): void {
    // Empty timetable
    this.data = { periods: [] };

    // Initialize lookup tables as objects to be able to get elements by key
    if (this.timetable()) {
      if (this.timetable()!.periods) {
        this.periods = this.timetable()!.periods.reduce((prev, curr, i) => {
          if (!curr.id) {
            curr.id = i;
          }
          prev[curr.id] = curr;

          return prev;
        }, {});
      }
      if (this.timetable()!.timetable_days) {
        this.days = this.timetable()!.timetable_days.reduce((prev, curr) => {
          prev[curr.id ? curr.id : curr.front_id] = curr;
          return prev;
        }, {});
      }
      if (this.timetable()!.timetable_hours) {
        this.hours = this.timetable()!.timetable_hours.reduce((prev, curr) => {
          prev[curr.id ? curr.id : curr.front_id] = curr;
          return prev;
        }, {});
      }
      if (this.timetable()!.prices) {
        this.prices = this.timetable()!.prices.reduce((prev, curr) => {
          prev[curr.id ? curr.id : curr.front_id] = curr;
          return prev;
        }, {});
      }
      if (this.timetable()!.descriptions) {
        this.comments = this.timetable()!.descriptions.reduce((prev, curr) => {
          prev[curr.id ? curr.id : curr.front_id] = curr;
          return prev;
        }, {});
      }

      if (this.timetable()!.periods && this.timetable()!.periods.length > 0) {
        // Create periods
        this.timetable()!.periods.forEach((period, i) => {
          const p = {
            timetable_period: period.id,
            isFirstLink: false,
            isBelow: false,
            days: [],
            order: i,
          };

          this.data.periods.push(p);

          // Create days
          if (period.days.length > 0) {
            period.days.forEach((day, j) => {
              const d = {
                timetable_day: day.timetable_day_front_id,
                isFirstLink: false,
                isBelow: false,
                hours: [],
                order: j,
              };

              p.days.push(d);

              if (day.hours.length > 0) {
                day.hours.forEach((hour, k) => {
                  const h = {
                    timetable_hour: hour.timetable_hour_front_id,
                    isFirstLink: false,
                    isBelow: false,
                    price: hour.timetable_price_front_id,
                    isFirstLinkPrice: false,
                    isBelowPrice: false,
                    comment: hour.timetable_description_front_id,
                    isFirstLinkComment: true,
                    isBelowComment: false,
                    order: k,
                  };

                  d.hours.push(h);
                });
              } else {
                // When the is no hour info, initialize as empty
                d.hours.push({
                  timetable_hour: null,
                  isFirstLink: false,
                  isBelow: false,
                  price: null,
                  isFirstLinkPrice: false,
                  isBelowPrice: false,
                  comment: null,
                  isFirstLinkComment: false,
                  isBelowComment: false,
                  order: 0,
                });
              }
            });
          } else {
            // When there is no day info, initialize as empty
            p.days.push({
              timetable_day: null,
              isFirstLink: false,
              isBelow: false,
              hours: [
                {
                  timetable_hour: null,
                  isFirstLink: false,
                  isBelow: false,
                  price: null,
                  isFirstLinkPrice: false,
                  isBelowPrice: false,
                  comment: null,
                  isFirstLinkComment: false,
                  isBelowComment: false,
                  order: 0,
                },
              ],
              order: 0,
            });
          }
        });
      }
    }

    this.computeLinks();
  }

  /**
   * Initialize the data variable with an empty timetable
   */
  createEmptyTimetable(): void {
    this.data.periods.push({
      timetable_period: null,
      isFirstLink: false,
      isBelow: false,
      days: [
        {
          timetable_day: null,
          isFirstLink: false,
          isBelow: false,
          hours: [
            {
              timetable_hour: null,
              isFirstLink: false,
              isBelow: false,
              price: null,
              isFirstLinkPrice: false,
              isBelowPrice: false,
              comment: null,
              isFirstLinkComment: false,
              isBelowComment: false,
            },
          ],
        },
      ],
    });

    this.computeLinks();
  }

  /**
   * Delete timetable
   */
  deleteTimetable(): void {
    this.periods = {};
    this.days = {};
    this.hours = {};
    this.prices = {};
    this.comments = {};
    this.data = { periods: [] };

    this.computeLinks();
  }

  preview(): void {
    const value: TimetableValue = this.updateForm(true);
    this.previewFS
      .submit({ data: value.data, fields: 'timetable.html' })
      .pipe(
        map((result: Entity) => {
          this.dialog.open(InfoDialogComponent, {
            width: '800px',
            data: {
              title: 'Veure horari',
              html: this.sanitizer.bypassSecurityTrustHtml(result.timetable.html.replace(/&nbsp;/g, ' ')),
            },
          });
        }),
      )
      .subscribe();
  }

  /**
   * Update the form data to match expected data format
   */
  updateForm(getData = false): TimetableValue | null {
    const periods = [];

    // Period data
    // Here the API requires all the timetable structure
    this.data.periods.forEach((period, i) => {
      const p: any = {
        days: null,
        order: i,
      };

      if (this.periods[period.timetable_period]) {
        p.start_date = this.periods[period.timetable_period].start_date;
        p.end_date = this.periods[period.timetable_period].end_date;
        p.alias = this.periods[period.timetable_period].alias;

        // If the user has left empty the period data, write an empty alias
      } else {
        p.alias = '';
      }

      period.days.forEach((day, j) => {
        const d = {
          timetable_day_front_id: day.timetable_day,
          hours: null,
          order: j,
        };
        day.hours.forEach((hour, k) => {
          const h = {
            timetable_hour_front_id: hour.timetable_hour,
            timetable_price_front_id: hour.price,
            timetable_description_front_id: hour.comment,
            order: k,
          };
          if (!h.timetable_price_front_id) {
            delete h.timetable_price_front_id;
          }
          if (!h.timetable_description_front_id) {
            delete h.timetable_description_front_id;
          }
          if (!d.hours) {
            d.hours = [];
          }
          if (h.timetable_hour_front_id) {
            d.hours.push(h);
          }
        });
        if (!p.days) {
          p.days = [];
        }
        if (d.timetable_day_front_id) {
          p.days.push(d);
        }
      });
      periods.push(p);
    });

    // Lookup tables
    const timetable_days = Object.keys(this.days).map((i) => this.days[i]);
    const timetable_hours = Object.keys(this.hours).map((i) => this.hours[i]);
    const prices = Object.keys(this.prices).map((i) => this.prices[i]);
    const descriptions = Object.keys(this.comments).map((i) => this.comments[i]);

    const value = {
      data: {
        timetable: {
          periods: periods,
          timetable_days: timetable_days,
          timetable_hours: timetable_hours,
          prices: prices,
          descriptions: descriptions,
          hide: this.form.value.hide,
        },
      },
    };

    if (getData) {
      return value;
    }

    while (this.form.get('periods')['controls'].length) {
      this.formService().removeDataTimetablePeriods(0);
    }
    while (this.form.get('timetable_days')['controls'].length) {
      this.formService().removeDataTimetableTimetableDays(0);
    }
    while (this.form.get('timetable_hours')['controls'].length) {
      this.formService().removeDataTimetableTimetableHours(0);
    }
    while (this.form.get('prices')['controls'].length) {
      this.formService().removeDataTimetablePrices(0);
    }
    while (this.form.get('descriptions')['controls'].length) {
      this.formService().removeDataTimetableDescriptions(0);
    }

    this.formService().patch(value);

    return null;
  }

  /**
   * Initialize a timetable from the timetable of other entity
   * The function takes as input the result of an app-entity-select change event,
   * that's why the parameter entities is an array, although we just need 1 entity.
   *
   * @param {number[]} entities
   * @memberof TimetableComposerComponent
   */
  entitiesSelected(entities: number[]): void {
    if (entities !== undefined && entities.length > 0) {
      this.readFS
        .submit({
          id: entities[0],
          fields: 'timetable',
          expand:
            'timetable.~all,timetable.periods.days.hours,timetable.timetable_hours.~all,timetable.timetable_days.~all',
        })
        .pipe(
          map((val: Entity) => {
            this.timetable.set(val.timetable);
            this.timetable.set(CleanDataService.cleanID(this.timetable()!));
            this.prepareTimetableData();
            return val;
          }),
        )
        .subscribe();
    }
  }

  /**
   * Edit maneres: Period
   */
  editPeriod(index: number): void {
    this.openDialog(
      (newFrontId: number) => {
        this.data.periods[index].timetable_period = newFrontId;
      },
      this.data.periods[index].timetable_period,
      this.periods,
      TimetablePeriodDialogComponent,
      600,
    );
  }

  /**
   * Edit modals: Day
   */
  editDay(indexPeriod: number, index: number): void {
    this.openDialog(
      (newFrontId: number) => {
        this.data.periods[indexPeriod].days[index].timetable_day = newFrontId;
      },
      this.data.periods[indexPeriod].days[index].timetable_day,
      this.days,
      TimetableDayDialogComponent,
      1020,
    );
  }

  /**
   * Edit modals: Hour
   */
  editHour(indexPeriod: number, indexDay: number, index: number): void {
    this.openDialog(
      (newFrontId: number) => {
        this.data.periods[indexPeriod].days[indexDay].hours[index].timetable_hour = newFrontId;
      },
      this.data.periods[indexPeriod].days[indexDay].hours[index].timetable_hour,
      this.hours,
      TimetableHourDialogComponent,
      700,
    );
  }

  /**
   * Edit modals: Price
   */
  editPrice(indexPeriod: number, indexDay: number, index: number): void {
    this.openDialog(
      (newFrontId: number) => {
        this.data.periods[indexPeriod].days[indexDay].hours[index].price = newFrontId;
      },
      this.data.periods[indexPeriod].days[indexDay].hours[index].price,
      this.prices,
      TimetablePriceDialogComponent,
      600,
    );
  }

  /**
   * Edit maneres: Comment
   */
  editComment(indexPeriod: number, indexDay: number, index: number): void {
    this.openDialog(
      (newFrontId: number) => {
        this.data.periods[indexPeriod].days[indexDay].hours[index].comment = newFrontId;
      },
      this.data.periods[indexPeriod].days[indexDay].hours[index].comment,
      this.comments,
      TimetableCommentDialogComponent,
      600,
    );
  }

  /**
   * Open a dialog with the provided modal
   *
   * @param {Function} callback A callback funcion that will be called if the dialog return a success code
   * @param {number} dataId The id reference of the data to modify
   * @param {*} timetableObject The lookup table to search
   * @param {*} dialogComponent The DialogComponent to Open
   * @param {*} dialogSize The Dialog size
   */
  openDialog(callback: Function, dataId: number, timetableObject: any, dialogComponent: any, dialogSize: any): void {
    const dialogConfig: any = {
      width: dialogSize + 'px',
      maxWidth: '98%',
      panelClass: 'noPadding',
    };

    if (dataId) {
      dialogConfig.data = timetableObject[dataId];
    }

    const dialogRef = this.dialog.open(dialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Generate id if it's new
        if (result.id === -1) {
          let i = 1;
          while (timetableObject[i] !== undefined) {
            i++;
          }
          result.id = null;
          result.front_id = i;
          callback(i);
          dataId = i;
        } else {
          result.front_id = timetableObject[dataId].front_id;
        }

        timetableObject[dataId] = result;
        this.computeLinks();
      }
    });
  }

  /**
   * Calculate weather the text should be shown or just the link
   * If it's the first shown element, we display the text (isFirstLink = true)
   * If it's not the first shown element, we determine if the upper cell contains the same text
   *      - Upper cell contains the same text: isBelow = true
   *      - Upper cell is different: isBelow = false
   */
  computeLinks(): void {
    const periods = [];
    const days = [];
    const hours = [];
    const prices = [];
    const comments = [];

    let lastPeriod = null;
    let lastDay = null;
    let lastHour = null;
    let lastPrice = null;
    let lastComment = null;

    this.data.periods.forEach((period) => {
      // Check if this period is already added
      if (period.timetable_period && periods.indexOf(period.timetable_period) !== -1) {
        period.isFirstLink = false;
        period.isBelow = period.timetable_period === lastPeriod;
      } else {
        period.isFirstLink = true;
        if (period.timetable_period) {
          periods.push(period.timetable_period);
        }
      }

      lastPeriod = period.timetable_period;
      period.days.forEach((day) => {
        // Check if this day is already added
        if (day.timetable_day && days.indexOf(day.timetable_day) !== -1) {
          day.isFirstLink = false;
          day.isBelow = day.timetable_day === lastDay;
        } else {
          day.isFirstLink = true;
          if (day.timetable_day) {
            days.push(day.timetable_day);
          }
        }

        lastDay = day.timetable_day;

        day.hours.forEach((hour) => {
          // Check if this day is already added
          if (hour.timetable_hour && hours.indexOf(hour.timetable_hour) !== -1) {
            hour.isFirstLink = false;
            hour.isBelow = hour.timetable_hour === lastHour;
          } else {
            hour.isFirstLink = true;
            if (hour.timetable_hour) {
              hours.push(hour.timetable_hour);
            }
          }

          // Check if this price is already added
          if (hour.price && prices.indexOf(hour.price) !== -1) {
            hour.isFirstLinkPrice = false;
            hour.isBelowPrice = hour.price === lastPrice;
          } else {
            hour.isFirstLinkPrice = true;
            if (hour.price) {
              prices.push(hour.price);
            }
          }

          // Check if this price is already added
          if (hour.comment && comments.indexOf(hour.comment) !== -1) {
            hour.isFirstLinkComment = false;
            hour.isBelowComment = hour.comment === lastComment;
          } else {
            hour.isFirstLinkComment = true;
            if (hour.comment) {
              comments.push(hour.comment);
            }
          }

          lastHour = hour.timetable_hour;
          lastPrice = hour.price;
          lastComment = hour.comment;
        });
      });
    });

    this.hovering = {};
    this.changeDetectorRef.detectChanges();

    this.updateForm();
  }

  /*
              Linking functions
              We have one function for each column: Period, Day, Hour, Price and Comment
              */
  linkPeriod(element: any, index: number): void {
    this.data.periods[index].timetable_period = parseInt(element.key, 10);
    this.computeLinks();
  }

  linkDay(element: any, indexPeriod: number, index: number): void {
    this.data.periods[indexPeriod].days[index].timetable_day = parseInt(element.key, 10);
    this.computeLinks();
  }

  linkHour(element: any, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].timetable_hour = parseInt(element.key, 10);
    this.computeLinks();
  }

  linkPrice(element: any, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].price = parseInt(element.key, 10);
    this.computeLinks();
  }

  linkComment(element: any, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].comment = parseInt(element.key, 10);
    this.computeLinks();
  }

  /*
  Unlinking functions
  We have one function for each column: Period, Day, Hour, Price and Comment
  */
  unlinkPeriod(element: any, index: number): void {
    this.data.periods[index].timetable_period = null;
    this.computeLinks();
  }

  unlinkDay(element: Object, indexPeriod: number, index: number): void {
    this.data.periods[indexPeriod].days[index].timetable_day = null;
    this.computeLinks();
  }

  unlinkHour(element: Object, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].timetable_hour = null;
    this.computeLinks();
  }

  unlinkPrice(element: Object, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].price = null;
    this.computeLinks();
  }

  unlinkComment(element: Object, indexPeriod: number, indexDay: number, index: number): void {
    this.data.periods[indexPeriod].days[indexDay].hours[index].comment = null;
    this.computeLinks();
  }

  /*
              Move functions
              We have one function for each column: Period, Day, Hour, Price and Comment
            */

  movePeriod(upOrDown: string, index: number): void {
    let newPosition: number = index - 1;
    if (upOrDown === 'down') {
      newPosition += 2;
    }

    const period = _.cloneDeep(this.data.periods[index]); // Copy the element
    this.data.periods.splice(index, 1); // Delete the element

    // This setTimeout is just for improving the animation effect
    setTimeout(() => {
      this.data.periods.splice(newPosition, 0, period); // Insert in new position

      this.computeLinks();
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
    }, 300);
  }

  cloneTimeTableObject(timetableObject: any, data: any): number {
    // Generate id if it's new
    let i = 1;
    while (timetableObject[i] !== undefined) {
      i++;
    }
    const newData = _.cloneDeep(data);
    newData.id = null;
    newData.front_id = i;
    if (newData.day_details) {
      newData.day_details.forEach((detail: any) => (detail.id = null));
    }
    if (newData.hour_details) {
      newData.hour_details.forEach((detail: any) => (detail.id = null));
    }
    timetableObject[newData.front_id] = newData;

    return i;
  }

  clonePeriod(index: number): void {
    // Clone row
    const period = _.cloneDeep(this.data.periods[index]); // Copy the element

    // Clone all elements referenced by the row
    period.timetable_period = this.cloneTimeTableObject(
      this.periods,
      this.periods[this.data.periods[index].timetable_period],
    );

    period.days.forEach((day) => {
      if (day.timetable_day) {
        day.timetable_day = this.cloneTimeTableObject(this.days, this.days[day.timetable_day]);
      }

      day.hours.forEach((hour) => {
        if (hour.timetable_hour) {
          hour.timetable_hour = this.cloneTimeTableObject(this.hours, this.hours[hour.timetable_hour]);
        }
        if (hour.price) {
          hour.price = this.cloneTimeTableObject(this.prices, this.prices[hour.price]);
        }
        if (hour.comment) {
          hour.comment = this.cloneTimeTableObject(this.comments, this.comments[hour.comment]);
        }
      });
    });

    // This setTimeout is just for improving the animation effect
    setTimeout(() => {
      this.data.periods.splice(index + 1, 0, period); // Insert in new position

      this.computeLinks();
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
    }, 300);
  }

  moveDay(upOrDown: string, indexPeriod: number, index: number): void {
    let newPosition = index - 1;
    if (upOrDown === 'down') {
      newPosition += 2;
    }

    const day = _.cloneDeep(this.data.periods[indexPeriod].days[index]); // Copy the element
    this.data.periods[indexPeriod].days.splice(index, 1); // Delete the element

    // This setTimeout is just for improving the animation effect
    setTimeout(() => {
      this.data.periods[indexPeriod].days.splice(newPosition, 0, day); // Insert in new position

      this.computeLinks();
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
    }, 300);
  }

  moveHour(upOrDown: string, indexPeriod: number, indexDay: number, index: number): void {
    let newPosition = index - 1;
    if (upOrDown === 'down') {
      newPosition += 2;
    }

    const hour = _.cloneDeep(this.data.periods[indexPeriod].days[indexDay].hours[index]); // Copy the element
    this.data.periods[indexPeriod].days[indexDay].hours.splice(index, 1); // Delete the element

    // This setTimeout is just for improving the animation effect
    setTimeout(() => {
      this.data.periods[indexPeriod].days[indexDay].hours.splice(newPosition, 0, hour); // Insert in new position

      this.computeLinks();
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
    }, 300);
  }

  /*
              Creation functions
              We have one function for each column: Period, Day, Hour, Price and Comment
            */

  // Creation
  addPeriod(upOrDown: string, index: number): void {
    if (upOrDown === 'down') {
      index += 1;
    }

    this.data.periods.splice(index, 0, {
      timetable_period: null,
      isFirstLink: false,
      isBelow: false,
      days: [
        {
          timetable_day: null,
          isFirstLink: false,
          isBelow: false,
          hours: [
            {
              isFirstLink: false,
              isBelow: false,
              timetable_hour: null,
              price: null,
              isFirstLinkPrice: false,
              isBelowPrice: false,
              comment: null,
              isFirstLinkComment: false,
              isBelowComment: false,
            },
          ],
        },
      ],
    });

    this.computeLinks();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  addDay(upOrDown: string, indexPeriod: number, index: number): void {
    if (upOrDown === 'down') {
      index += 1;
    }

    this.data.periods[indexPeriod].days.splice(index, 0, {
      timetable_day: null,
      isFirstLink: false,
      isBelow: false,
      hours: [
        {
          isFirstLink: false,
          isBelow: false,
          timetable_hour: null,
          price: null,
          isFirstLinkPrice: false,
          isBelowPrice: false,
          comment: null,
          isFirstLinkComment: false,
          isBelowComment: false,
        },
      ],
    });

    this.computeLinks();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  addHour(upOrDown: string, indexPeriod: number, indexDay: number, index: number): void {
    if (upOrDown === 'down') {
      index += 1;
    }

    this.data.periods[indexPeriod].days[indexDay].hours.splice(index, 0, {
      isFirstLink: false,
      isBelow: false,
      timetable_hour: null,
      price: null,
      isFirstLinkPrice: false,
      isBelowPrice: false,
      comment: null,
      isFirstLinkComment: false,
      isBelowComment: false,
    });

    this.computeLinks();
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  /* Deletion functions
    We have one function for each column: Period, Day, Hour, Price and Comment
  */

  private showSnackBar(
    message: string,
    index: number,
    array: any,
    deletedElement: any,
    newElementAdded: boolean,
  ): void {
    this.hovering = {};
    this.snackBarRef = this.snackBar.open(message, 'Desfer', {
      duration: 8000,
    });
    this.snackBarRef.onAction().subscribe(() => {
      if (newElementAdded) {
        array.splice(index, 1);
      }
      array.splice(index, 0, deletedElement);
    });

    this.computeLinks();
  }

  removePeriod(index: number): void {
    let newElementAdded = false;
    const element = this.data.periods.splice(index, 1);

    if (this.data.periods.length === 0) {
      this.addPeriod('up', 0);
      newElementAdded = true;
    }

    this.showSnackBar('Període eliminat', index, this.data.periods, element[0], newElementAdded);
  }

  removeDay(indexPeriod: number, index: number): void {
    let newElementAdded = false;
    const element = this.data.periods[indexPeriod].days.splice(index, 1);
    if (this.data.periods[indexPeriod].days.length === 0) {
      this.addDay('up', indexPeriod, 0);
      newElementAdded = true;
    }

    this.showSnackBar('Dia eliminat', index, this.data.periods[indexPeriod].days, element[0], newElementAdded);
  }

  removeHour(indexPeriod: number, indexDay: number, index: number): void {
    let newElementAdded = false;
    const element = this.data.periods[indexPeriod].days[indexDay].hours.splice(index, 1);
    if (this.data.periods[indexPeriod].days[indexDay].hours.length === 0) {
      this.addHour('up', indexPeriod, indexDay, 0);
      newElementAdded = true;
    }

    this.showSnackBar(
      'Hora eliminada',
      index,
      this.data.periods[indexPeriod].days[indexDay].hours,
      element[0],
      newElementAdded,
    );
  }

  /** Hovering Effects */

  periodHover(state: boolean, upOrDown: string, periodIndex: number): void {
    this.createPeriod(periodIndex);
    this.hovering[periodIndex][upOrDown] = state;
  }

  dayHover(state: boolean, upOrDown: string, periodIndex: number, dayIndex: number): void {
    this.createDay(periodIndex, dayIndex);
    this.hovering[periodIndex].days[dayIndex][upOrDown] = state;
  }

  hourHover(state: any, upOrDown: string, periodIndex: number, dayIndex: number, hourIndex: number): void {
    this.createHour(periodIndex, dayIndex, hourIndex);
    this.hovering[periodIndex].days[dayIndex].hours[hourIndex][upOrDown] = state;
  }

  private createPeriod(periodIndex: number): void {
    if (!this.hovering[periodIndex]) {
      this.hovering[periodIndex] = {
        days: {},
      };
    }
  }

  private createDay(periodIndex: number, dayIndex: number): void {
    this.createPeriod(periodIndex);
    if (!this.hovering[periodIndex].days[dayIndex]) {
      this.hovering[periodIndex].days[dayIndex] = {
        hours: {},
      };
    }
  }

  private createHour(periodIndex: number, dayIndex: number, hourIndex: number): void {
    this.createDay(periodIndex, dayIndex);
    if (!this.hovering[periodIndex].days[dayIndex].hours[hourIndex]) {
      this.hovering[periodIndex].days[dayIndex].hours[hourIndex] = {};
    }
  }

  toogleHideTimetable(): void {
    this.form.patchValue({ hide: !this.form.value.hide });
  }
}
