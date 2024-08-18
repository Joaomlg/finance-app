import BancoDoBrasilLogo from '../assets/icon/banco_do_brasil_logo.svg';
import BancoInterLogo from '../assets/icon/banco_inter_logo.svg';
import BradescoLogo from '../assets/icon/bradesco_logo.svg';
import CaixaLogo from '../assets/icon/caixa_logo.svg';
import ItauLogo from '../assets/icon/itau_logo.svg';
import NubankLogo from '../assets/icon/nubank_logo.svg';
import SantanderLogo from '../assets/icon/santander_logo.svg';

const svgCatalog = {
  banco_do_brasil_logo: BancoDoBrasilLogo,
  banco_inter_logo: BancoInterLogo,
  bradesco_logo: BradescoLogo,
  caixa_logo: CaixaLogo,
  itau_logo: ItauLogo,
  nubank_logo: NubankLogo,
  santander_logo: SantanderLogo,
};

export type SvgKey = keyof typeof svgCatalog;

export const getSvgComponent = (key: SvgKey) => {
  return svgCatalog[key];
};
