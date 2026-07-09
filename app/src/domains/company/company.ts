import { initialDemoCompany, useCompanyStore } from '@/state/companyStore';

export type Company = {
  currency: 'CAD';
  id: string;
  logo: string;
  name: string;
  pricingProfileId: string;
  primaryColor: string;
  secondaryColor: string;
  serviceArea: string;
  shortName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  website: string;
};

export const demoCompany: Company = initialDemoCompany;

export function getActiveCompany() {
  return useCompanyStore.getState().activeCompany;
}
