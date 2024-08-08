import { useState } from 'react';
import { createUser, getUserById } from '../apiService';

// Hook para registrar un nuevo usuario
export const useRegisterUser = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const newUser = await createUser(userData);
      setUserInfo(newUser);
      return newUser;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { userInfo, loading, error, registerUser };
};

// Hook para obtener un usuario por ID
export const useFetchUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, fetchUser };
};
