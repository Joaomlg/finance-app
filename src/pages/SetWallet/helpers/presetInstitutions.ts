import { SvgKey } from '../../../utils/svg';

export type PresetInstitution = {
  id: number;
  name: string;
  logoSvg: SvgKey;
  primaryColor: string;
};

const presetInstitutions: PresetInstitution[] = [
  {
    id: 1,
    name: 'Nubank',
    logoSvg: 'nubank_logo',
    primaryColor: '#820AD1',
  },
  {
    id: 2,
    name: 'Banco do Brasil',
    logoSvg: 'banco_do_brasil_logo',
    primaryColor: '#fdf429',
  },
  {
    id: 3,
    name: 'Banco Inter',
    logoSvg: 'banco_inter_logo',
    primaryColor: '#ea7100',
  },
  {
    id: 4,
    name: 'Bradesco',
    logoSvg: 'bradesco_logo',
    primaryColor: '#cc092f',
  },
  {
    id: 5,
    name: 'Caixa Econômica Federal',
    logoSvg: 'caixa_logo',
    primaryColor: '#006bab',
  },
  {
    id: 6,
    name: 'Itaú',
    logoSvg: 'itau_logo',
    primaryColor: '#33348e',
  },
  {
    id: 7,
    name: 'Santander',
    logoSvg: 'santander_logo',
    primaryColor: '#ec0000',
  },
];

export default presetInstitutions;
