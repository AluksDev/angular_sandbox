export interface DepartmentResponse {
    count:    number;
    next:     null;
    previous: null;
    results:  Department[];
}

export interface DepartmentBackendItem {
    id:   number;
    name: string;
    code: string;
}

export interface Department extends DepartmentBackendItem {
  icon: string;
}
