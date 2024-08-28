import {
  BANCO_DO_BRASIL_LOGO_SVG_URL,
  BANCO_INTER_LOGO_SVG_URL,
  BRADESCO_LOGO_SVG_URL,
  CAIXA_LOGO_SVG_URL,
  ITAU_LOGO_SVG_URL,
  NUBANK_LOGO_SVG_URL,
  SANTANDER_LOGO_SVG_URL,
} from '../../../utils/svg';

export type PresetInstitution = {
  id: number;
  name: string;
  imageUrl: string;
  primaryColor: string;
};

const presetInstitutions: PresetInstitution[] = [
  {
    id: 1,
    name: 'Nubank',
    imageUrl: NUBANK_LOGO_SVG_URL,
    primaryColor: '#820AD1',
  },
  {
    id: 2,
    name: 'Banco do Brasil',
    imageUrl: BANCO_DO_BRASIL_LOGO_SVG_URL,
    primaryColor: '#fdf429',
  },
  {
    id: 3,
    name: 'Banco Inter',
    imageUrl: BANCO_INTER_LOGO_SVG_URL,
    primaryColor: '#ea7100',
  },
  {
    id: 4,
    name: 'Bradesco',
    imageUrl: BRADESCO_LOGO_SVG_URL,
    primaryColor: '#cc092f',
  },
  {
    id: 5,
    name: 'Caixa Econômica Federal',
    imageUrl: CAIXA_LOGO_SVG_URL,
    primaryColor: '#006bab',
  },
  {
    id: 6,
    name: 'Itaú',
    imageUrl: ITAU_LOGO_SVG_URL,
    primaryColor: '#33348e',
  },
  {
    id: 7,
    name: 'Santander',
    imageUrl: SANTANDER_LOGO_SVG_URL,
    primaryColor: '#ec0000',
  },
];

export default presetInstitutions;
