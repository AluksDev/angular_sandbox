import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    forwardRef,
} from '@angular/core';
import { async } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GlobalDataService } from 'app/utils/global-data.service';
import { Observable, Subject, concat, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
} from 'rxjs/operators';
import { GeneralMasterTables } from '../../../../../api/defs/GeneralMasterTables';
import { GeneralMasterTablesListFormService } from '../../../../../api/forms/general-master-tables/list/list.service';

@Component({
    selector: 'app-area-autocomplete',
    templateUrl: './area-autocomplete.component.html',
    styleUrls: ['../autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AreaAutocompleteComponent),
            multi: true,
        },
    ],
})
export class AreaAutocompleteComponent
    implements OnInit, ControlValueAccessor, OnChanges
{
    area: any;
    areaData: any = [];
    modelArea: any;

    area$: Observable<GeneralMasterTables[]>;
    areaInput$ = new Subject<string>();
    areaLoading = false;

    visible = true;

    @Input()
    set data(value: any) {
        if (value) {
            if (value.length > 0) {
                // this.areaData.push(...value);
                this.areaData = value;
            } else {
                this.areaData.push(value);
            }

            this.visible = false;
            setTimeout(() => {
                this.visible = true;
            }, 100); // restart
        } else {
            this.prepareAreaList();
        }
    }

    @Input() addValue = false;
    @Input() multiple: boolean;
    @Input() disabled: boolean;
    @Input() heightAuto: boolean;
    @Input() bgWhite: boolean;
    @Input() placeholder: string;
    @Input() labelName: string;
    @Input() required: boolean;
    @Input() serverErrors: any;
    @Input() field: string;
    @Input() scope: number;
    @Input() control: any;
    @Input() readonly: boolean;
    @Input() matMinLength: number;
    @Input() maxSelectedItems: number;
    @Input() position = 'auto';
    @Input() canCreate = false;
    @Input() allData: boolean;
    @Input() type: string;
    @Input() typeId: number;
    @Input() allTypes: boolean;
    @Input() module: string;
    @Input() filterIsActive = true;
    @Input() filterIds: number[];
    @Input() excludeIds: number[];
    @Input() filterParentIds: number[];
    @Input() excludeParentIds: number[];
    @Input() showTypeLabel = false;
    @Input() resetSelectedItem: boolean;

    @Output()
    create = new EventEmitter<string>();

    @Output()
    emit = new EventEmitter<number[]>();

    @Output()
    changes = new EventEmitter<void>();

    // @Output()
    // typeahead = new EventEmitter<string>();

    @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
    constructor(
        public areaListFS: GeneralMasterTablesListFormService,
        public tablesMaster: GlobalDataService
    ) {}

    ngOnInit(): void {
        this.prepareAreaList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.type) {
            if (changes?.type?.currentValue) {
                this.area$ = concat(
                    of(
                        this.areaData.filter(
                            (a) => a.type === changes?.type?.currentValue
                        )
                    )
                );
            }
        }
        if (
            changes?.typeId ||
            changes?.filterIds ||
            changes?.excludeIds ||
            changes?.filterParentIds ||
            changes?.excludeParentIds
        ) {
            if (
                changes?.typeId?.currentValue ||
                changes?.filterIds?.currentValue ||
                changes?.excludeIds?.currentValue ||
                changes?.filterParentIds?.currentValue ||
                changes?.excludeParentIds?.currentValue
            ) {
                this.prepareAreaList();
            }
        }
        if (changes?.resetSelectedItem) {
            if (
                changes?.resetSelectedItem?.currentValue &&
                changes?.resetSelectedItem?.currentValue === true
            ) {
                this.area = null;
                this.modelArea = null;
                this.ngSelectComponent?.handleClearClick();
            }
        }
    }

    clearItem(item): void {
        if (!this.disabled) {
            this.ngSelectComponent.clearItem(item);
        }
    }

    setArea(node): void {
        if (node) {
            if (this.multiple) {
                this.area = [];
                for (const i in node) {
                    if (node[i]) {
                        if (this.allData) {
                            this.area.push(node[i]);
                        } else {
                            this.area.push(node[i].id);
                        }
                    }
                }
            } else {
                if (this.allData) {
                    this.area = node;
                } else {
                    this.area = node.id;
                }
            }
        } else {
            this.area = null;
            this.modelArea = null;
        }
        this.emit.emit(this.area);
        this.propagateChange(this.area);
        this.changes.emit(this.area);
    }

    propagateChange = (_: any) => {
        /* */
    };

    writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            this.area = value;
            this.modelArea = value;
        } else {
            if (this.multiple) {
                this.area = [];
                this.modelArea = [];
            }
        }
    }

    registerOnChange(fn): void {
        this.propagateChange = fn;
    }

    registerOnTouched(): void {
        /* */
    }

    public prepareAreaList(): void {
        this.area$ = concat(
            of(this.areaData), // Default is an empty list
            this.areaInput$.pipe(
                startWith(''),
                debounceTime(100),
                distinctUntilChanged(),
                switchMap((term: string) => {
                    return this.tablesMaster.masterTables.pipe(
                        map((value) => {
                            if (this.filterIsActive) {
                                return value.filter(
                                    (mt) => mt.is_active === true
                                );
                            } else {
                                return value;
                            }
                        }),
                        map((value) => {
                            if (!!this.allTypes) {
                                return value;
                            } else if (this.typeId) {
                                return value.filter(
                                    (tm) => tm.type == this.typeId
                                );
                            } else {
                                return value.filter(
                                    (tm) =>
                                        tm.type ==
                                        Number(
                                            this.tablesMaster.getMasterTypesByFilter(
                                                this.type
                                            )[0]?.id
                                        )
                                );
                            }
                        }),
                        map((value) => {
                            if (this.filterIds && this.filterIds.length > 0) {
                                return value.filter((tm) =>
                                    this.filterIds.includes(tm.id)
                                );
                            } else {
                                return value;
                            }
                        }),
                        map((value) => {
                            if (this.excludeIds && this.excludeIds.length > 0) {
                                return value.filter(
                                    (tm) => !this.excludeIds.includes(tm.id)
                                );
                            } else {
                                return value;
                            }
                        }),
                        map((value) => {
                            if (
                                this.filterParentIds &&
                                this.filterParentIds.length > 0
                            ) {
                                return value.filter((tm) => {
                                    if (tm.parent_table.length > 0) {
                                        return this.filterParentIds.some(
                                            (id) => {
                                                return tm.parent_table.includes(
                                                    id
                                                );
                                            }
                                        );
                                    } else {
                                        return false;
                                    }
                                });
                            } else {
                                return value;
                            }
                        }),
                        map((value) => {
                            if (
                                this.excludeParentIds &&
                                this.excludeParentIds.length > 0
                            ) {
                                return value.filter((tm) => {
                                    if (tm.parent_table.length > 0) {
                                        return !this.excludeParentIds.some(
                                            (id) => tm.parent_table.includes(id)
                                        );
                                    } else {
                                        return true;
                                    }
                                });
                            } else {
                                return value;
                            }
                        }),
                        map((value: GeneralMasterTables[]) => {
                            if (term) {
                                return value.filter((tm) =>
                                    tm.name
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .toUpperCase()
                                        .includes(
                                            term
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .toUpperCase()
                                        )
                                );
                            } else {
                                return value;
                            }
                        }),
                        map((data: GeneralMasterTables[]) => {
                            this.areaData.push(data);
                            let idsNotArray = [];
                            if (this.control?.value) {
                                if (this.control?.value instanceof Array) {
                                    idsNotArray = this.control?.value.filter(
                                        (id) =>
                                            !this.areaData
                                                .map((i) => i.id)
                                                .includes(id)
                                    );
                                } else {
                                    if (
                                        !this.areaData
                                            .map((i) => i.id)
                                            .includes(this.control?.value)
                                    ) {
                                        idsNotArray = [this.control?.value];
                                    }
                                }
                            }
                            if (idsNotArray && idsNotArray.length > 0) {
                                this.tablesMaster.masterTables
                                    .pipe(
                                        map((value) => {
                                            return value.filter((tm) =>
                                                idsNotArray.includes(tm.id)
                                            );
                                        })
                                    )
                                    .subscribe((extraData) => {
                                        this.areaData.push(...extraData);
                                        data.push(...extraData);
                                    });
                            }
                            return data;
                        })
                    );
                })
            )
        );
    }

    createNew = (tag) => {
        this.create.emit(tag);
    };

    protected readonly async = async;
}
