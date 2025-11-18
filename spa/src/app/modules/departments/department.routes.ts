import { Routes } from "@angular/router";
import { DepartmentListComponent } from "./department-list.component/department-list.component";
import { Error404Component } from "@modules/error404/error404.component";
import { DepartmentDetailComponent } from "./department-detail.component/department-detail.component";



export const departmnetRoutes: Routes = [


    {
        path:'',
        data: { breadcrumb: 'Department' },
        children: [
            {
                path:'',
                component: DepartmentListComponent,
            },
            {
                path:'department/:id',
                loadComponent: () => DepartmentDetailComponent
            },

              
            { 
                path: "**", 
                loadComponent: () => Error404Component
            },
            
        ]
    }

]

export default departmnetRoutes;