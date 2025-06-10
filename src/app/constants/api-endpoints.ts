import { environment } from "../../environments/environments";

export const API_ENDPOINTS = {
  AREA_CODES: `${environment.apiBaseUrl}/Config/AreaCodes`,
  USERS: `${environment.apiBaseUrl}/Users`,
  SERVICE_PROVIDER_TYPES: `${environment.apiBaseUrl}/Config/ServiceProviderTypes`,
  SERVICES_PAGE: `${environment.apiBaseUrl}/Service`,
 
};