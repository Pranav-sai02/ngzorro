export interface Call {
  CaseDetailId: number;
  CaseStatus: string;
  CaseNumber: string;
  CaseReferenceNumber: string;
  ClientId: number;
  ServiceId: number;
  HappyClient: boolean;
  HappyService: boolean;
  CaseCreatedDate: string;
  CaseOpenedDate: string;
  CaseCompletedDate: string | null;
  ClosingComment: string;
  CreatedByUserId: string;
  CreatedDate: string;
  NeverCreateClaim: boolean;
  CaseCaller: {
    CallerFirstName: string;
    CallerLastName: string;
  } | null;
}