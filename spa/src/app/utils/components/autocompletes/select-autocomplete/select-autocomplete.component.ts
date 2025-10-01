import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgSelectComponent, NgSelectModule } from "@ng-select/ng-select";
import { Observable, Subject, async, debounceTime, distinctUntilChanged, of, startWith, switchMap } from "rxjs";

@Component({
  selector: "app-select-autocomplete",
  templateUrl: "./select-autocomplete.component.html",
  styleUrls: ["../autocomplete.component.scss"],
  standalone: true,
  imports: [CommonModule, NgSelectModule, AsyncPipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAutocompleteComponent),
      multi: true,
    },
  ],
})
export class SelectAutocompleteComponent implements OnInit, ControlValueAccessor {
  select: any;
  selectData: any = [];
  modelSelect: any;

  select$: Observable<any[]>;
  selectInput$ = new Subject<string>();
  selectLoading = false;

  visible = true;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input()
  set data(value: any) {
    if (value) {
      if (value.length > 0) {
        this.selectData = [...value];
      } else {
        this.selectData = [value];
      }
      this.prepareSelectList();
      this.visible = false;
      setTimeout(() => {
        this.visible = true;
      }, 100); // restar
    } else {
      this.selectData = [];
    }
  }

  @Input() multiple: boolean;
  @Input() disabled: boolean;
  @Input() heightAuto: boolean;
  @Input() bgWhite: boolean;
  @Input() placeholder: string;
  @Input() labelName: string;
  @Input() required: boolean;
  @Input() serverErrors: any;
  @Input() control: any;
  @Input() readonly: boolean;
  @Input() matMinLength: number;
  @Input() maxSelectedItems: number;
  @Input() field: string;
  @Input() position = "auto";
  @Input() canCreate = false;
  @Input() allData: boolean;
  @Input() type: string;
  @Input() parent: string;
  @Input() plusParent: string;
  @Input() filterIds: number[];
  @Input() filterIsActive = true;
  @Input() status: any;
  @Input() filter: object;

  @Output()
  create = new EventEmitter<string>();

  @Output()
  emit = new EventEmitter<any>();

  @Output()
  delete = new EventEmitter<any>();

  @Output()
  changes = new EventEmitter<void>();

  @Output()
  typeahead = new EventEmitter<string>();

  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  constructor() {}

  ngOnInit(): void {
    this.prepareSelectList();
    if (!this.matMinLength && this.matMinLength !== 0) {
      this.matMinLength = 1;
    }
    this.selectInput$.subscribe((value) => {
      this.typeahead.emit(value);
    });
  }

  setSelect(node): void {
    if (node) {
      if (this.multiple) {
        this.select = [];
        for (const i in node) {
          if (node[i]) {
            if (this.allData) {
              this.select.push(node[i]);
            } else {
              if (node[i].id) {
                this.select.push(node[i].id);
              }
            }
          }
        }
      } else {
        if (this.allData) {
          this.select = node;
        } else {
          this.select = node.id;
        }
      }
    } else {
      this.select = null;
      this.modelSelect = null;
    }
    this.emit.emit(this.select);
    this.propagateChange(this.select);
    this.changes.emit(this.select);
  }

  propagateChange = (_: any) => {
    /** */
  };

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.select = value;
      this.modelSelect = value;
    } else {
      if (this.multiple) {
        this.select = [];
        this.modelSelect = [];
      } else {
        this.select = null;
        this.modelSelect = null;
      }
    }
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    /* */
  }

  public prepareSelectList(): void {
    this.select$ = this.selectInput$.pipe(
      startWith(""),
      debounceTime(150),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term) {
          return of(
            this.selectData.filter((tm) => {
              tm?.name
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toUpperCase()
                .includes(
                  term
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toUpperCase()
                );
            })
          );
        } else return of(this.selectData);
      }),
      // switchMap((data) => {
      //     if (this.filterIsActive !== undefined) {
      //         const data = of(
      //             this.selectData.filter(
      //                 (tm) => tm.is_active === this.filterIsActive
      //             )
      //         );
      //         return data;
      //     } else return of(data);
      // }),
      switchMap((data) => {
        if (this.filter) {
          const keys = Object.keys(this.filter);

          return of(
            data.filter((element) => {
              let result = true;
              keys.forEach((key) => {
                if (element[key] !== this.filter[key]) {
                  result = false;
                }
              });
              return result;
            })
          );
        } else {
          return of(data);
        }
      }),
      switchMap((data) => {
        if (this.filterIds) {
          return of(data.filter((s) => this.filterIds.includes(s.id)));
        } else {
          return of(data);
        }
      })
    );
  }

  createNew = (tag) => {
    this.create.emit(tag);
  };

  clearItem(item): void {
    if (!this.disabled) {
      this.ngSelectComponent.clearItem(item);
    }
  }

  deleteSelect(item) {
    this.delete.emit(item);
  }

  protected readonly async = async;
}
