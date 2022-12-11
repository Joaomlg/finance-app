import { useContext } from 'react';
import AppContext from '../contexts/appContext';

const usePluggyService = () => {
  const { pluggyClient } = useContext(AppContext);

  return pluggyClient;
}

export default usePluggyService;