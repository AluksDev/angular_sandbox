import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators - passwordMatchValidator', () => {
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      password: new FormControl(''),
      password_confirm: new FormControl('')
    });
  });

  it('should return null when passwords match', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: 'myPassword123',
      password_confirm: 'myPassword123'
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should return passwordMismatch error when passwords do not match', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: 'myPassword123',
      password_confirm: 'differentPassword'
    });
    
    const result = validator(formGroup);
    expect(result).toEqual({ passwordMismatch: true });
  });

  it('should return null when password is empty', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: '',
      password_confirm: 'somePassword'
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should return null when password_confirm is empty', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: 'somePassword',
      password_confirm: ''
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should return null when both passwords are empty', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: '',
      password_confirm: ''
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should be case sensitive', () => {
    const validator = CustomValidators.passwordMatchValidator();
    formGroup.patchValue({
      password: 'MyPassword123',
      password_confirm: 'myPassword123'
    });
    
    const result = validator(formGroup);
    expect(result).toEqual({ passwordMismatch: true });
  });

  it('should handle special characters in passwords', () => {
    const validator = CustomValidators.passwordMatchValidator();
    const specialPassword = 'P@ssw0rd!#$%';
    formGroup.patchValue({
      password: specialPassword,
      password_confirm: specialPassword
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });

  it('should handle long passwords', () => {
    const validator = CustomValidators.passwordMatchValidator();
    const longPassword = 'a'.repeat(100);
    formGroup.patchValue({
      password: longPassword,
      password_confirm: longPassword
    });
    
    const result = validator(formGroup);
    expect(result).toBeNull();
  });
});