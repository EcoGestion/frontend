import React from 'react';
import Modal from 'react-modal';

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
    },
    overlay: {
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
};

const AcceptConfirmationModal = ({
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
          className="bg-gray-dark border-medium border-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-3 rounded-medium mt-4" 
          onClick={onRequestClose}
          style={{ flex: 1, marginRight: '10px' }}
        >
          Cancelar
        </button>
        <button
          type='button'
          className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark mt-4 hover:border-green-light'
          onClick={onConfirm}
          style={{ flex: 1, marginLeft: '10px' }}
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

export default AcceptConfirmationModal;