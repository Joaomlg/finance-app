import BancoDoBrasilLogo from '../assets/icon/banco_do_brasil_logo.svg';
import BancoInterLogo from '../assets/icon/banco_inter_logo.svg';
import BradescoLogo from '../assets/icon/bradesco_logo.svg';
import CaixaLogo from '../assets/icon/caixa_logo.svg';
import ItauLogo from '../assets/icon/itau_logo.svg';
import NubankLogo from '../assets/icon/nubank_logo.svg';
import SantanderLogo from '../assets/icon/santander_logo.svg';

const LOCAL_SVG_SCHEMA = 'finance.app.svg://';

export const BANCO_DO_BRASIL_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'banco_do_brasil_logo';
export const BANCO_INTER_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'banco_inter_logo';
export const BRADESCO_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'bradesco_logo';
export const CAIXA_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'caixa_logo';
export const ITAU_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'itau_logo';
export const NUBANK_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'nubank_logo';
export const SANTANDER_LOGO_SVG_URL = LOCAL_SVG_SCHEMA + 'santander_logo';

const localSvgRegistry = {
  [BANCO_DO_BRASIL_LOGO_SVG_URL]: BancoDoBrasilLogo,
  [BANCO_INTER_LOGO_SVG_URL]: BancoInterLogo,
  [BRADESCO_LOGO_SVG_URL]: BradescoLogo,
  [CAIXA_LOGO_SVG_URL]: CaixaLogo,
  [ITAU_LOGO_SVG_URL]: ItauLogo,
  [NUBANK_LOGO_SVG_URL]: NubankLogo,
  [SANTANDER_LOGO_SVG_URL]: SantanderLogo,
};

export const isLocalSvgComponent = (src: string) => src.startsWith(LOCAL_SVG_SCHEMA);

export const getLocalSvgComponent = (src: string) => localSvgRegistry[src];
