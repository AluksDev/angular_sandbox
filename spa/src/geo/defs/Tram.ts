/* tslint:disable:max-line-length */
/**
 * v1
 * GEORest
 * netiproa.corppro.imi.bcn:447
 */

export interface Tram {
  CODI_TRAM?: string;
  CONTINUITAT?: string;
  CARRER_DRE?: string;
  NUMPOST_IDRE1?: string;
  LLEPOST_IDRE1?: string;
  NUMPOST_FDRE1?: string;
  LLEPOST_FDRE1?: string;
  NUMPOST_IDRE2?: string;
  LLEPOST_IDRE2?: string;
  NUMPOST_FDRE2?: string;
  LLEPOST_FDRE2?: string;
  CARRER_ESQ?: string;
  NUMPOST_IESQ1?: string;
  LLEPOST_IESQ1?: string;
  NUMPOST_FESQ1?: string;
  LLEPOST_FESQ1?: string;
  NUMPOST_IESQ2?: string;
  LLEPOST_IESQ2?: string;
  NUMPOST_FESQ2?: string;
  LLEPOST_FESQ2?: string;
  /** format: int32 */
  COORD_X?: number;
  /** format: int32 */
  COORD_Y?: number;
  /** format: float */
  LONGITUD?: number;
  /** format: float */
  ANGLE?: number;
  DTE_DRE?: string;
  ILLA_DRE?: string;
  DTE_ESQ?: string;
  ILLA_ESQ?: string;
  ROTULAR_DRE?: string;
  /** format: int32 */
  PUNT_ROTUL_DRE_X?: number;
  /** format: int32 */
  PUNT_ROTUL_DRE_Y?: number;
  /** format: float */
  ANGLE_ROTUL_DRE?: number;
  ROTULAR_ESQ?: string;
  /** format: int32 */
  PUNT_ROTUL_ESQ_X?: number;
  /** format: int32 */
  PUNT_ROTUL_ESQ_Y?: number;
  /** format: float */
  ANGLE_ROTUL_ESQ?: number;
  NUM_ORDRE_DRE?: string;
  NUM_ORDRE_ESQ?: string;
  CODI_NUS_INI?: string;
  CODI_NUS_FIN?: string;
  /** format: int32 */
  XMIN?: number;
  /** format: int32 */
  YMIN?: number;
  /** format: int32 */
  XMAX?: number;
  /** format: int32 */
  YMAX?: number;
  /** format: date-time */
  DATA_ALTA?: string;
  PUNTOS?: string;
  /** format: int32 */
  EntityState?: EntityStateTramEnum;
  /** format: double */
  Id?: number;
}

export type EntityStateTramEnum = '2' | '4' | '8' | '16';
