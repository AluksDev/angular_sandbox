import { TestBed } from '@angular/core/testing';
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

    let storageService: StorageService;

    const mockLocalGetItem = jest.fn();
    const mockLocalSetItem = jest.fn();
    Object.defineProperty(window, "localStorage", {
    value: {
        getItem: (...args: string[]) => mockLocalGetItem(...args),
        setItem: (...args: string[]) => mockLocalSetItem(...args),
    },
    });

    const mockSessionGetItem = jest.fn();
    const mockSessionSetItem = jest.fn();
    Object.defineProperty(window, "sessionStorage", {
    value: {
        getItem: (...args: string[]) => mockSessionGetItem(...args),
        setItem: (...args: string[]) => mockSessionSetItem(...args),
    },
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [],
        providers: [StorageService]
        });

        storageService = TestBed.inject(StorageService);
        jest.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(storageService).toBeTruthy();
    });

    it('should save the token in localStorage', () => {
        storageService.setAccessToken("token");

        expect(mockLocalSetItem).toHaveBeenCalledTimes(1);
        expect(mockLocalSetItem).toHaveBeenCalledWith('auth_token', 'token');

    });

    it('should return undefined if token is not in localStorage', () => {
        
        const token = storageService.getAccessToken();
        mockLocalGetItem.mockReturnValue(undefined);


        expect(mockLocalGetItem).toHaveBeenCalledTimes(1);
        expect(mockLocalGetItem).toHaveBeenCalledWith('auth_token');

        expect(token).toBeUndefined();

    });


    it('should return the token if it is in localStorage', () => {
        
        const myToken =  "token";
        mockLocalGetItem.mockReturnValue(myToken);
        
        storageService.setAccessToken(myToken);
        const resToken = storageService.getAccessToken();

        expect(resToken).toBe(myToken);

    });

    it('should clean access token ', () => {
        
        storageService.clearToken();

        expect(mockLocalSetItem).toHaveBeenCalledTimes(1);
        expect(mockLocalSetItem).toHaveBeenCalledWith('auth_token', null);

    });


    it('should clean all data ', () => {
        
        storageService.clearAll();

        expect(mockLocalSetItem).toHaveBeenCalledTimes(1);
        expect(mockSessionSetItem).toHaveBeenCalledTimes(1);
        expect(mockLocalSetItem).toHaveBeenCalledWith('auth_token', null);
        expect(mockSessionSetItem).toHaveBeenCalledWith('user', null);

    });

    it('should save the token in sessionStorage', () => {
        storageService.setUser(mockUser);

        expect(mockSessionSetItem).toHaveBeenCalledTimes(1);
        expect(mockSessionSetItem).toHaveBeenCalledWith('user',  JSON.stringify(mockUser) );

    });

    it('should return undefined if token is not in sessionStorage', () => {
        
        const token = storageService.getUser();
        mockLocalGetItem.mockReturnValue(undefined);


        expect(mockSessionGetItem).toHaveBeenCalledTimes(1);
        expect(mockSessionGetItem).toHaveBeenCalledWith('user');

        expect(token).toBeUndefined();

    });


    it('should return the user if it is in sessionStorage', () => {
        
        mockSessionGetItem.mockReturnValue( JSON.stringify(mockUser) );
        
        storageService.setUser(mockUser);
        const resUser = storageService.getUser();

        expect(resUser).toStrictEqual(mockUser);

    });
    
    
    


  
});
