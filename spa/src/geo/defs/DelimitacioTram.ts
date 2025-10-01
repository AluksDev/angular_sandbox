/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface DelimitacioTram {
  NumIni?: string;
  LetraIni?: string;
  NumFin?: string;
  LetraFin?: string;
  CalleIni?: string;
  CalleFin?: string;
  TramIni?: string;
  TramFin?: string;
  NusIni?: string;
  NusFin?: string;
  /** format: int32 */
  EntityState?: EntityStateDelimitacioTramEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateDelimitacioTramEnum = '2' | '4' | '8' | '16';
