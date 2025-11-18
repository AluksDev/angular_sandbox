import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthSignInComponent } from "./sign-in.component";
import { AuthService } from "@app/core/auth/services/auth.service";
import { RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { FuseAlertComponent } from "@fuse/components/alert";
import { provideRouter } from '@angular/router';
import { Component} from "@angular/core"
import { MatIconRegistry } from "@angular/material/icon";
import { By, DomSanitizer } from "@angular/platform-browser";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from "rxjs";




@Component({  template: '<h1>Forgot Page</h1>'})
class MockForgotPassword {}

@Component({  template: '<h1>SignUp Page</h1>'})
class MockSignUp {}

const mockAuthService = {
  login: jest.fn()
};


describe('SigInComponent unitarios', () =>{

    let fixture: ComponentFixture<AuthSignInComponent>;
    let component: AuthSignInComponent;
    let service: AuthService;


    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                AuthSignInComponent,
                FuseAlertComponent,
                RouterLink,
                HttpClientTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                provideRouter([
                    {path: 'auth/forgot-password', component: MockForgotPassword},
                    {path: 'auth/sign-up', component: MockSignUp},
                ]),
                 { provide: AuthService, useValue: mockAuthService },
                FormBuilder,
                MatIconRegistry
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthSignInComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(AuthService);
        
        const matIconRegistry = TestBed.inject(MatIconRegistry);
        const domSanitizer = TestBed.inject(DomSanitizer);
        
        matIconRegistry.addSvgIconInNamespace(
          'heroicons_solid',
          'eye',
          domSanitizer.bypassSecurityTrustResourceUrl('dummy-path.svg')
        );

        matIconRegistry.addSvgIconInNamespace(
          'heroicons_solid',
          'eye-slash',
          domSanitizer.bypassSecurityTrustResourceUrl('dummy-path.svg')
        );

        matIconRegistry.addSvgIconInNamespace(
          'heroicons_solid',
          'x-mark',
          domSanitizer.bypassSecurityTrustResourceUrl('dummy-path.svg')
        );
        
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should have an username input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[formControlName="username"]');
      expect(input).toBeTruthy();
      
    });

    it('should have a password input', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[formControlName="password"]');
      expect(input).toBeTruthy();
      
    });

    it('should have a Sign In button', () => {
      const form = fixture.nativeElement.querySelector('form');
      const button = form.querySelector('button');
      expect(button).toBeTruthy();
      
    });

    it('should be invalid if form is empty', () => {
      component.signInForm.markAllAsTouched()

      expect(component.signInForm.invalid).toBeTruthy();

      fixture.detectChanges();

      const errorSpans = fixture.nativeElement.querySelectorAll('span.text-red-600');
      const lastErrorSpan = errorSpans[errorSpans.length - 1];
      expect(lastErrorSpan?.textContent).toContain('Todos los campos son obligatorios');

    });

    it('should be invalid if username is empty', () => {
      const emailControl = component.signInForm.get('username');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      fixture.detectChanges();

      const errorSpan = fixture.nativeElement.querySelector('span.text-red-600');

      expect(emailControl?.invalid).toBeTruthy();
      expect(component.signInForm.invalid).toBeTruthy();
      expect(errorSpan?.textContent).toContain('El campo username es requerido');

    });

    it('should be invalid if password is empty', () => {
      const emailControl = component.signInForm.get('password');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      fixture.detectChanges();

      const errorSpan = fixture.nativeElement.querySelector('span.text-red-600');

      expect(emailControl?.invalid).toBeTruthy();
      expect(component.signInForm.invalid).toBeTruthy();
      expect(errorSpan?.textContent).toContain('El campo password es requerido');

    });

    it('should be loading when sending a request', () => {
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      fixture.detectChanges();

      expect(component.isLoading()).toBeTruthy();
      expect(component.signInForm.disable).toBeTruthy();

      const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
      expect(spinner).toBeTruthy();
      const span = fixture.nativeElement.querySelector('button div span');
      expect(span.textContent.trim()).toBe('Iniciando sesión');
      

    });


    it('should be enable if request fails', () => {
      mockAuthService.login.mockReturnValue(of({success: false}));
      
      component.signInForm.setValue({
        username: 'jdoe',
        password: '123456',
      });
      
      fixture.detectChanges();
      
      
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));
      
      fixture.detectChanges();
      
      const span = fixture.nativeElement.querySelector('button div span');
      expect(span.textContent.trim()).toBe('Iniciar sesión');
      expect(component.isLoading()).toBeFalsy();
      expect(component.signInForm.enable).toBeTruthy();


      
    });
    
    it('should be loading when sending a request', () => {
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      fixture.detectChanges();

      expect(component.isLoading()).toBeTruthy();
      expect(component.signInForm.disable).toBeTruthy();

      const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
      expect(spinner).toBeTruthy();
      const span = fixture.nativeElement.querySelector('button div span');
      expect(span.textContent.trim()).toBe('Iniciando sesión');
      

    });


    it('should be enable if request fails', () => {
      mockAuthService.login.mockReturnValue(of({success: false}));
      
      component.signInForm.setValue({
        username: 'jdoe',
        password: '123456',
      });
      
      fixture.detectChanges();
      
      
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));
      
      fixture.detectChanges();
      
      const span = fixture.nativeElement.querySelector('button div span');
      expect(span.textContent.trim()).toBe('Iniciar sesión');
      expect(component.isLoading()).toBeFalsy();
      expect(component.signInForm.enable).toBeTruthy();


      
    });


});