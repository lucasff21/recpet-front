import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { findAllAdocoes } from '../services/ApiAdocao';
import { AuthContext } from './AuthContext';

const AdoptionContext = createContext();

export const AdoptionProvider = ({ children }) => {
  const [userAdoptions, setUserAdoptions] = useState([]);
  const [loadingAdoptions, setLoadingAdoptions] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchUserAdoptions = async () => {
    setLoadingAdoptions(true);
    try {
      const response = await findAllAdocoes();
      setUserAdoptions(response.data || []);
    } catch (error) {
      console.error('Falha ao buscar adoções do usuário:', error);
      setUserAdoptions([]);
    } finally {
      setLoadingAdoptions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserAdoptions();
    } else {
      setUserAdoptions([]);
      setLoadingAdoptions(false);
    }
  }, [isAuthenticated]);

  const addAdoption = (newAdoption) => {
    setUserAdoptions((prev) => [...prev, newAdoption]);
  };

  const removeAdoption = (adoptionId) => {
    setUserAdoptions((prev) => prev.filter((ad) => ad.id !== adoptionId));
  };

  const pendingAnimalIds = useMemo(
    () =>
      new Set(
        userAdoptions
          .filter(
            (ad) => ad.status === 'PENDENTE' || ad.status === 'EM_ANALISE'
          )
          .filter((ad) => ad.animal)
          .map((ad) => ad.animal.id)
      ),
    [userAdoptions]
  );

  const value = {
    userAdoptions,
    pendingAnimalIds,
    loadingAdoptions,
    addAdoption,
    removeAdoption,
    refreshAdoptions: fetchUserAdoptions,
  };

  return (
    <AdoptionContext.Provider value={value}>
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoptions = () => useContext(AdoptionContext);
