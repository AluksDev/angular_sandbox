import { Directive, Injector } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, NgControl } from '@angular/forms';

@Directive()
export abstract class BaseFormControlAccessor implements ControlValueAccessor {
    formControl: FormControl;
    
    constructor(private injector: Injector){}
    ngOnInit() {
        const ngControl = this.injector.get(NgControl);
        if (!ngControl) return;
        if (ngControl instanceof FormControlName) {
            this.formControl = this.injector
                .get(FormGroupDirective)
                .getControl(ngControl);
        } else {
            this.formControl = (ngControl as FormControlDirective)
                .form as FormControl;
        }
    }
    
    value: string;
    isDisabled: boolean;
    onChange: (value: string) => void;
    onTouched: () => void;

    writeValue(value: any) {
        this.value = value || '';
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }
}