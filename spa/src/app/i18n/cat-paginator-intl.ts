import { MatPaginatorIntl } from '@angular/material/paginator';

const catRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) {
    return `0 de ${length}`;
  }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getCatPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elements per pàgina:';
  paginatorIntl.nextPageLabel = 'Pàgina següent';
  paginatorIntl.previousPageLabel = 'Pàgina anterior';
  paginatorIntl.getRangeLabel = catRangeLabel;

  return paginatorIntl;
}
