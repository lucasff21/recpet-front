import { useState } from 'react';
import './styles.css';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h2>Confirmação</h2>
            <p>{message}</p>
            <div className="flex justify-content-between gap-2">
              <button onClick={handleCancel} className="button">
                Cancelar
              </button>
              <button onClick={handleConfirm} className="button btn-danger">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
