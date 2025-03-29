
export interface OnboardingInvite {
  id: string;
  email: string;
  organization_id?: string;
  facility_id?: string;
  department_id?: string;
  role_id?: string;
  invited_by: string;
  invited_at?: string;
  expires_at: string;
  token: string;
  used: boolean;
}
