import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassificationNode } from '@api/defs/ClassificationNode';
import { ClassificationNodeList } from '@api/defs/ClassificationNodeList';
import { ExpandedClassificationNodeExpandedClassificationNode } from '@api/defs/ExpandedClassificationNodeExpandedClassificationNode';
import { SecondaryFilter } from '@api/defs/SecondaryFilter';
import { SecondaryFilterList } from '@api/defs/SecondaryFilterList';
import { ClassificationExpandedES } from '@api/defs/ClassificationExpandedES';

export class Utils {
  static processServerErrors(controls: FormGroup, serverErrors: object): void {
    if (typeof serverErrors === 'object') {
      Object.keys(serverErrors).forEach((field) => {
        if (controls[field] instanceof FormArray) {
          // Recursively check errores in FormArrays
          for (let i = 0; i < serverErrors[field].length; i++) {
            Utils.processServerErrors(controls[field].controls[i]['controls'], serverErrors[field][i]);
          }
        } else if (controls[field] instanceof FormGroup) {
          // Recursively check errores in FormArrays
          Utils.processServerErrors(controls[field], serverErrors[field]);
        } else {
          if (controls[field]) {
            controls[field].setErrors({ serverError: true });
            /**
             *  If it's a server error, we have to show it even if the user hasn't entered the field yet
             */
            controls[field].markAsTouched();
          }
        }
      });
    }
  }

  /*
    Configure dataSource interceptor to order results
    1. With dependency group goes first
      1.1 Ordering by order
      1.2 Ordering by name
    2. Ordering by ancestors order
    3. If same order then order by node name
    4. If same ancestors:
      4.1 If brothers: First by order, then by name
      4.2 If aunt and uncle: First by brothers order, then by brothers name
      4.3 If father and son: father goes first
   */
  public static orderingMethod = (
    results: Observable<
      ClassificationNodeList | ExpandedClassificationNodeExpandedClassificationNode | SecondaryFilterList
    >,
  ): Observable<ClassificationNodeList | ExpandedClassificationNodeExpandedClassificationNode | SecondaryFilterList> =>
    results.pipe(
      map((result) => {
        if (result.results === null) {
          result.results = [];
        }

        result.results.forEach((elem: ClassificationNode | ClassificationExpandedES | SecondaryFilter) => {
          // the root dependency_group is copied to every child
          if (elem.ancestors === undefined) {
            elem['ancestors'] = [];
          }
          if (elem.dependency_group === undefined) {
            elem.dependency_group = null;
            elem.dependency_group_data = null;
          }
        });
        result.results.sort((a, b) => Utils.orderingAlgorithm(a, b));
        return result;
      }),
    );

  public static orderingAlgorithm = (
    a: ClassificationNode | SecondaryFilter,
    b: ClassificationNode | SecondaryFilter,
  ): 1 | -1 => {
    // If one node has dependency_group and the other does not, the first one goes first
    if (a.dependency_group_data === null && b.dependency_group_data !== null) {
      return 1;
    } else if (a.dependency_group_data !== null && b.dependency_group_data === null) {
      return -1;
    } else {
      // Now the dependency groups order manage the sort
      if (a.dependency_group_data !== null && b.dependency_group_data !== null) {
        if (a.dependency_group_data.order < b.dependency_group_data.order) {
          return -1;
        } else if (a.dependency_group_data.order > b.dependency_group_data.order) {
          return 1;
        } else {
          // Now the dependency groups name manage the sort
          if (a.dependency_group_data.name < b.dependency_group_data.name) {
            return -1;
          } else if (a.dependency_group_data.name > b.dependency_group_data.name) {
            return 1;
          }
          // If both names are equals, continue ordering by nodes
        }
      }
      // Now the nodes order manage the sort
      const min_length = a.ancestors.length < b.ancestors.length ? a.ancestors.length : b.ancestors.length;
      for (let i = 0; i < min_length; i++) {
        if (a.ancestors[i].order < b.ancestors[i].order) {
          return -1;
        } else if (a.ancestors[i].order > b.ancestors[i].order) {
          return 1;
        } else {
          // Same order, so the name rules
          if (a.ancestors[i].name < b.ancestors[i].name) {
            return -1;
          } else if (a.ancestors[i].name > b.ancestors[i].name) {
            return 1;
          }
        }
      }

      // Same common ancestors, so now the nodes are relatives:
      // - brothers
      // - aunt and ancle
      // - father and son
      if (a.ancestors.length === b.ancestors.length) {
        // They are brothers, so their order rules
        if (a.order !== b.order) {
          return a.order < b.order ? -1 : 1;
        } else {
          // There is no specified order, so it is sorted by name
          return a.name < b.name ? -1 : 1;
        }
      } else {
        let younger = a;
        let older = b;
        if (a.ancestors.length < b.ancestors.length) {
          younger = b;
          older = a;
        }
        if (younger.ancestors[min_length].id === older.id) {
          // father and soon
          return older === a ? -1 : 1;
        } else {
          // aunt and ancle, so the order is defined by the brother of the ancle
          if (younger.ancestors[min_length].order < older.order) {
            // younger goes first
            return younger === a ? -1 : 1;
          } else if (younger.ancestors[min_length].order > older.order) {
            // older goes first
            return older === a ? -1 : 1;
          } else {
            // There is no specified order, so it is sorted by brother's name
            if (younger.ancestors[min_length].name < older.name) {
              // younger goes first
              return younger === a ? -1 : 1;
            } else {
              // older goes first
              return older === a ? -1 : 1;
            }
          }
        }
      }
    }
  };
}
