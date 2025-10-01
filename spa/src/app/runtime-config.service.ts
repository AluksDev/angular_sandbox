import { Injectable } from "@angular/core";

export interface IdpConfig {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
}

@Injectable({
  providedIn: "root",
})
export class RuntimeConfigService {
  constructor() {}
}
