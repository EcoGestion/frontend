import React, { useState } from 'react';
import Modal from 'react-modal';
import VerificationInput from "react-verification-input";

const styles = {
  modal: {
    content: {
      width: '350px',
      height: '300px',
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

const CodeConfirmationModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const [code, setCode] = useState('');

  const confirm = () => {
    onConfirm(code);
    setCode('');
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={styles.modal}>
      <div className='flex flex-col h-full'>
        <div className='flex-1'>
          <h2 className='text-center font-semibold mt-2'>{"Ingrese el código de 6 digitos que le dará el generador"}</h2>
          <div className='text-center mt-4'>
            <VerificationInput
              length={6}
              value={code}
              onChange={(value) => setCode(value)}
              autoFocus={true}
            />
          </div>
        </div>
        <div className='flex-1 pt-4'>
          <button 
            type='button'
            className="bg-gray-dark hover:bg-gray-light text-white font-semibold py-2 px-3 rounded-medium shadow-md transition duration-300 mt-4" 
            onClick={onRequestClose}
            style={{ flex: 1, marginRight: '10px' }}
          >
            Cancelar
          </button>
          <button
            type='button'
            className='bg-white text-green-dark px-3 py-2 rounded-medium border-medium border-green-dark font-semibold mt-4'
            onClick={() => confirm()}
            style={{ flex: 1, marginLeft: '10px' }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CodeConfirmationModal;