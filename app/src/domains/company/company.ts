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

export const demoCompany: Company = {
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

export function getActiveCompany() {
  return demoCompany;
}
