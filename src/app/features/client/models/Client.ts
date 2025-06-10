import { AreaCodes } from '../../areacodes/models/AreaCodes';

export interface Client {
  Id?: number;
  Name: string;
  ClaimsManager?: string;
  AreaCode: string;
  Telephone: string;
  isDeleted?: boolean;
  IsActive: boolean;
  Address?: string;
  Fax?: string;
  WebURL?: string;
  CompanyLogo?: string;

  ClientGroup: string;
 // GroupName: string;
}
