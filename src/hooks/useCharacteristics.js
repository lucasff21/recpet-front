import { useState, useEffect, useCallback } from 'react';
import {
  findAllCaracteristicas,
  deactivateCaracteristica,
  reactivateCaracteristica,
} from '../services/ApiCharacteristics';
import { showToast } from '../utils/toast';

export const useCharacteristics = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState('');

  const fetchItems = useCallback(
    (name = filterName) => {
      setLoading(true);
      const params = name ? { nome: name } : {};

      findAllCaracteristicas(params)
        .then((res) => {
          setItems(res.data || []);
        })
        .catch(() => showToast('Erro ao carregar características', 'error'))
        .finally(() => setLoading(false));
    },
    [filterName]
  );

  const toggleAtivo = (id, isAtivo) => {
    const action = isAtivo
      ? deactivateCaracteristica
      : reactivateCaracteristica;
    const successMessage = isAtivo
      ? 'Característica desativada com sucesso'
      : 'Característica reativada com sucesso';

    action(id)
      .then(() => {
        showToast(successMessage, 'success');
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, ativo: !isAtivo } : item
          )
        );
      })
      .catch(() =>
        showToast('Erro ao alterar status da característica', 'error')
      );
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    filterName,
    setFilterName,
    fetchItems,
    toggleAtivo,
  };
};
