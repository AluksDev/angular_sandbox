"""
Filtros
"""
from django.db.models import F
from django.db.models.constants import LOOKUP_SEP
from rest_framework.filters import SearchFilter, OrderingFilter


class SearchUnaccentFilter(SearchFilter):
    def construct_search(self, field_name, queryset):
        lookup = self.lookup_prefixes.get(field_name[0])
        if lookup:
            field_name = field_name[1:]
        else:
            lookup = 'unaccent__icontains'
        return LOOKUP_SEP.join([field_name, lookup])


class NullsLastOrderingFilter(OrderingFilter):
    """
        Alters OrderingFilter to always let registers with a
        Null value in the ordering columns last.
    """

    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        if ordering:
            fields_to_order = []
            for order in ordering:
                if not order:
                    continue
                if order[0] == '-':
                    fields_to_order.append(F(order[1:]).desc(nulls_last=True))
                else:
                    fields_to_order.append(F(order).asc(nulls_last=True))

            return queryset.order_by(*fields_to_order)

        return queryset
