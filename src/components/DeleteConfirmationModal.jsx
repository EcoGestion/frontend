import React from 'react';
import Modal from 'react-modal';
import GreenRoundedButton from '@components/greenRoundedButton';

const styles = {
  modal: {
    content: {
      width: '300px',
      height: '200px',
      margin: 'auto',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }
};

const DeleteConfirmationModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title = "Seguro que desea continuar con la operación?"
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          type='button'
          className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4" 
          onClick={onRequestClose}
          style={{ flex: 1, marginRight: '10px' }}
        >
          Cancelar
        </button>
        <button
          type='button'
          className="bg-green-dark hover:bg-green-light text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300 mt-4"
          onClick={onConfirm}
          style={{ flex: 1, marginLeft: '10px' }}
        >
          Eliminar
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;