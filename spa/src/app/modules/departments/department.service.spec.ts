import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { DepartmentService } from "./department.service";
import { Department, DepartmentCreate, DepartmentUpdate } from "@api/defs/Department";
import { environment } from "environments/environment.hmr";


const API_URL = environment.apiUrl;

describe('DepartmentService', () => {

    let service: DepartmentService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [
            DepartmentService,
            provideHttpClient(),
            provideHttpClientTesting()
        ]
        });

        service = TestBed.inject(DepartmentService);
        httpMock = TestBed.inject(HttpTestingController);

    });

    afterEach(() => {
        httpMock.verify();
    });


    it('should be instantiable', () => {
        expect(service).toBeTruthy();
    });

    it('should return the item (create)', () => {
        const department: DepartmentCreate = {
            name: "Recursos Humanos",
            code: "RRHH"
        }

        const resp = { id: 123, name: department.name, code: department.code };

        service.create(department).subscribe(
            respuesta => {
                expect(respuesta).toEqual(resp);
            }
        );

        const req = httpMock.expectOne(`${API_URL}/department/`);

        expect(req.request.method).toEqual('POST'); 
        expect(req.request.body).toEqual(department);

        req.flush(resp);

    });

    it('should return error if name exits (create)', () => {
        const department: DepartmentCreate = {
            name: "Ventas",
        }

        const statusText = 'Ya existe departamento con ese nombre';
        const statusCode = 500;

        service.create(department).subscribe({
        next: () => fail('Expected error and received success'),
        error: error => {
            expect(error.status).toBe(statusCode);
            expect(error.message).toBe(statusText);
        }
        });

        const req = httpMock.expectOne(`${API_URL}/department/`);
        expect(req.request.method).toEqual('POST');

        req.flush({ status: statusCode, statusText: statusText });
    });

    it('should return the item (update)', () => {
        const departmentId = 123;
        const department: DepartmentUpdate = {
            name: "Recursos Humanos",
            code: "RRHH"
        }

        const resp = { id: departmentId, name: department.name, code: department.code };

        service.update(departmentId, department).subscribe(
            respuesta => {
                expect(respuesta).toEqual(resp);
            }
        );

        const req = httpMock.expectOne(`${API_URL}/department/${departmentId}/`);

        expect(req.request.method).toEqual('PATCH'); 
        expect(req.request.body).toEqual(department);

        req.flush(resp);

    });

    it('should return error if name exits (update)', () => {
        const departmentId = 123;
        const department: DepartmentCreate = {
            name: "Ventas",
        }

        const statusText = 'Ya existe departamento con ese nombre';
        const statusCode = 500;

        service.update(departmentId, department).subscribe({
        next: () => fail('Expected error and received success'),
        error: error => {
            expect(error.status).toBe(statusCode);
            expect(error.message).toBe(statusText);
        }
        });

        const req = httpMock.expectOne(`${API_URL}/department/${departmentId}/`);
        expect(req.request.method).toEqual('PATCH'); 

        req.flush({ status: statusCode, statusText: statusText });
    });

    it('should delete a department and return void', () => {
        const departmentId = 123;

        const statusText = 'Ya existe departamento con ese nombre';
        const statusCode = 500;

        service.delete(departmentId).subscribe({
           next: (respuesta) => {
                expect(respuesta).toBeFalsy(); 
            },
            error: () => {
                fail('Expected success bur error received');
            }
    });

        const req = httpMock.expectOne(`${API_URL}/department/${departmentId}`);
        expect(req.request.method).toEqual('DELETE'); 

        req.flush(null, { status: 204, statusText: 'No Content' });
    });


});