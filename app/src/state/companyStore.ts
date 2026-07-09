import { create } from 'zustand';

import type { Company } from '@/domains/company/company';

export const initialDemoCompany: Company = {
  currency: 'CAD',
  id: 'murrys-taxi',
  logo: 'placeholder',
  name: 'Murrys Taxi',
  pricingProfileId: 'murrys-standard',
  primaryColor: '#FFC107',
  secondaryColor: '#000000',
  serviceArea: 'Arnprior, Ontario',
  shortName: 'Murrys',
  supportEmail: 'support@murrystaxi.demo',
  supportPhone: '+1 613-295-9335',
  timezone: 'America/Toronto',
  website: 'https://murrystaxi.demo',
};

type CompanyStore = {
  activeCompany: Company;
  setActiveCompany: (company: Company) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
  activeCompany: initialDemoCompany,
  setActiveCompany: (company) => set({ activeCompany: company }),
}));
