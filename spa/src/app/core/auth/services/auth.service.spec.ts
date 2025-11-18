import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';


describe('AuthService', () => {
    const mockUser = { 
        id: 1, 
        username: 'jdoe',
        email: "user@google.com",
        first_name: "",
        last_name: "",
        department: null
    
    };

    const mockResponse = {
        token: 'token',
        user: mockUser,
    };

    const mockData = {
        username: "jdoe",
        password: "Pass123!"
    }

    let service: AuthService;
    let storageService: StorageService;
    let httpMock: HttpTestingController;

    const authStorageStub = {
        setUser: jest.fn(),
        setAccessToken: jest.fn(),
        clearToken: jest.fn(),
        clearAll: jest.fn(),
        getAccessToken: jest.fn()
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService, 
            { provide: StorageService, useValue: authStorageStub },
        ]
        });

        service = TestBed.inject(AuthService);
        storageService = TestBed.inject(StorageService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be instantiable', () => {
        expect(service).toBeTruthy();
    });

    it('initial state is checking', () => {
        expect(service.authStatus()).toEqual('checking');
    })

    it('logout if there is not valid token', () => {
        authStorageStub.getAccessToken.mockReturnValue(null);

        service.checkStatus().subscribe((result) => {
            expect(result.success).toBe(false);
            expect(result.message).toBe("Token inválido");
        });

        
        expect(service.authStatus()).toBe('not-authenticated');
        expect(service.user()).toBe(null);
    });

    it('should return user info if the token is valid', () => {

        authStorageStub.getAccessToken.mockReturnValue('valid-token');

        service.checkStatus().subscribe((res) => {
            expect(res.success).toBe(true);
        });

        const req = httpMock.expectOne(
            '/services/sandbox/v1/auth/me'
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockUser);

        expect(service.user().id).toEqual(1);
        expect(service.user().username).toEqual('jdoe');
        expect(service.user().email).toEqual('user@google.com');
        expect(service.authStatus()).toEqual('authenticated');

    });

    it('should handle conexion error', () => {

        service.checkStatus().subscribe((res) => {
            expect(res.success).toBe(false);
            expect(res.message).toBe("No se pudo conectar con el servidor. Intenta nuevamente");
        });

        const req = httpMock.expectOne(
            '/services/sandbox/v1/auth/me'
        );
        expect(req.request.method).toBe('GET');

    });


    it('should handle 401 error', () => {

        service.checkStatus().subscribe((res) => {
            expect(res.success).toBe(false);
            expect(res.message).toBe("Tu sesión ha expirado. Por favor inicia sesión nuevamente");
        });

        const req = httpMock.expectOne(
            '/services/sandbox/v1/auth/me'
        );
        expect(req.request.method).toBe('GET');
        req.flush(
            { message: 'Token inválido' },
            { status: 401, statusText: 'Unauthorized' }
        );

        expect(service.user()).toEqual(null);
        expect(service.authStatus()).toEqual('expired');
        
    });

    it('should log in correctly', () => {
        
        const {username, password} = mockData;

        service.login(username, password).subscribe((res) => {
            expect(res.success).toBe(true);
        });

        const req = httpMock.expectOne(
            '/services/sandbox/v1/auth/login/'
        );
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);

        expect(service.user().id).toEqual(1);
        expect(service.user().username).toEqual('jdoe');
        expect(service.user().email).toEqual('user@google.com');
        expect(service.authStatus()).toEqual('authenticated');
    });


    it('should handle 400 error', () => {

        service.checkStatus().subscribe((res) => {
            expect(res.success).toBe(false);
            expect(res.message).toBe("Usuario o contraseña incorrectos");
        });

        const req = httpMock.expectOne(
            '/services/sandbox/v1/auth/me'
        );
        expect(req.request.method).toBe('GET');
        req.flush(
            { message: 'Unable to log in with provided credentials.' },
            { status: 400, statusText: 'Bad Request' }
        );
        
    });


  
});
