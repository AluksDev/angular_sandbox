import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb-component',
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './breadcrumb-component.html',
  styleUrl: './breadcrumb-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit{
  router = inject(Router);
  
  crumbs = signal<string[]>(['dashboard']);
  lastCrumb = input<string>();

  ngOnInit() {
    const segments = this.router.url.split('/').filter(Boolean);
    this.crumbs.update(prev => [...prev, ...segments]);
  }
 }
