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
    
    protected onChange = (v: any) => {};
    protected onTouched = () => {};
    
    writeValue(value: any): void {
       this.onChange(value)
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}