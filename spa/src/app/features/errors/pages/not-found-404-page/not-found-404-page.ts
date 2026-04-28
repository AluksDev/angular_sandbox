import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-not-found-404-page',
  imports: [RouterLink],
  templateUrl: './not-found-404-page.html',
  styleUrl: './not-found-404-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound404Page { 
  route = inject(ActivatedRoute);
  returnUrl = toSignal(
    this.route.queryParamMap.pipe(
      map(params => params.get('returnUrl') || '/')
    )
  );
}
