/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Poligons {
  TIPO?: string;
  CODIGO?: string;
  DESCRIPCION?: string;
  /** format: int32 */
  XMIN?: number;
  /** format: int32 */
  YMIN?: number;
  /** format: int32 */
  XMAX?: number;
  /** format: int32 */
  YMAX?: number;
  /** format: int32 */
  XCENT?: number;
  /** format: int32 */
  YCENT?: number;
  PUNTS?: string;
  /** format: int32 */
  EntityState?: EntityStatePoligonsEnum;
  /** format: double */
  Id?: number;
}

export type EntityStatePoligonsEnum = '2' | '4' | '8' | '16';
