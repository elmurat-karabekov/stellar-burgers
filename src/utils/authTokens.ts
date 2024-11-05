import { deleteCookie, setCookie } from './cookie';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  setCookie('accessToken', accessToken);

  localStorage.setItem('refreshToken', refreshToken);
};

export const deleteTokens = () => {
  deleteCookie('accessToken');

  localStorage.removeItem('refreshToken');
};
