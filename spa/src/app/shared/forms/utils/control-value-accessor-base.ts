import { Directive, Injector } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Directive({
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BaseFormControlAccessor,
      multi: true
    }
  ]
})
export abstract class BaseFormControlAccessor implements ControlValueAccessor {
    formControl: FormControl;
    
    constructor(private injector: Injector){}
    ngOnInit() {
        const ngControl = this.injector.get(NgControl);
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
        if (this.formControl) {
            this.formControl.setValue(value ?? '', { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (this.formControl) {
            isDisabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
}