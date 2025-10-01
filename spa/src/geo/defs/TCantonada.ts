/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TCantonada {
  CARRER1?: string;
  CARRER2?: string;
  CODI_NUS?: string;
  /** format: int32 */
  COORD_X?: number;
  /** format: int32 */
  COORD_Y?: number;
  /** format: int32 */
  EntityState?: EntityStateTCantonadaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTCantonadaEnum = '2' | '4' | '8' | '16';
