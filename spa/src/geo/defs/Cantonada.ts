/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Cantonada {
  CARRER1?: string;
  CODI_INE1?: string;
  CODI_DGC1?: string;
  TIPUS_VIA1?: string;
  NOM181?: string;
  NOM271?: string;
  NOM_COMPLET1?: string;
  NOM_ORDENAR1?: string;
  SEQUENCIA1?: string;
  APROVACIO1?: string;
  /** format: date-time */
  DATA_APROV1?: string;
  CARRER2?: string;
  CODI_INE2?: string;
  CODI_DGC2?: string;
  TIPUS_VIA2?: string;
  NOM182?: string;
  NOM272?: string;
  NOM_COMPLET2?: string;
  NOM_ORDENAR2?: string;
  SEQUENCIA2?: string;
  APROVACIO2?: string;
  /** format: date-time */
  DATA_APROV2?: string;
  CODI_NUS?: string;
  /** format: int32 */
  COORD_X?: number;
  /** format: int32 */
  COORD_Y?: number;
  NOM_OFICIAL1?: string;
  NOM_OFICIAL2?: string;
  /** format: int32 */
  EntityState?: EntityStateCantonadaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateCantonadaEnum = '2' | '4' | '8' | '16';
