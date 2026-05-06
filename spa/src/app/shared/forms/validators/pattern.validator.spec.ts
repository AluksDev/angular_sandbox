import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('validatePatter Validator', () => {

  it('should return null when value matches pattern', () => {
    const validator = CustomValidators.validatePatter('^[a-zA-Z]+$');

    const control = new FormControl('John');

    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should return error when value does not match pattern', () => {
    const validator = CustomValidators.validatePatter('^[a-zA-Z]+$');

    const control = new FormControl('John123');

    const result = validator(control);

    expect(result).toEqual({ patternInvalid: true });
  });

  it('should return null when value is empty', () => {
    const validator = CustomValidators.validatePatter('^[a-zA-Z]+$');

    const control = new FormControl('');

    const result = validator(control);

    expect(result).toBeNull();
  });

});