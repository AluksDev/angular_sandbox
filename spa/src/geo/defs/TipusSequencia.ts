/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface TipusSequencia {
  SEQUENCIA?: string;
  DESCRIPCIO?: string;
  /** format: int32 */
  EntityState?: EntityStateTipusSequenciaEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTipusSequenciaEnum = '2' | '4' | '8' | '16';
