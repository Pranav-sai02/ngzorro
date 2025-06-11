import { environment } from "../../environments/environments";
import { ClientGroupState } from "../features/client/client-group-state/client-group.state";
import { ClientGroupService } from "../features/client/services/client-group-services/client-group.service";

export const API_ENDPOINTS = {
  AREA_CODES: `${environment.apiBaseUrl}/Config/AreaCodes`,
  USERS: `${environment.apiBaseUrl}/Users`,
  SERVICE_PROVIDER_TYPES: `${environment.apiBaseUrl}/Config/ServiceProviderTypes`,
  SERVICES_PAGE: `${environment.apiBaseUrl}/Service`,
  CLIENTGROUP: `${environment.apiBaseUrl}/ClientGroup`,
 
};