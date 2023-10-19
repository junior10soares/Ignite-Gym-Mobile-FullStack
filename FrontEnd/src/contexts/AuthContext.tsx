import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { ReactNode, createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO;
    singIn: (email: string, password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true)
            await storageUserSave(userData);
            await storageAuthTokenSave({ token, refresh_token });
        } catch (error) {
            throw error

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);
        } catch (error) {
            throw error;
        }
    }

    async function singIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });
            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token);
                userAndTokenUpdate(data.user, data.token)
            }

        } catch (error) {
            throw error

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function loadUserData() { // usuario continua logado
        try {
            setIsLoadingUserStorageData(true);
            const userLogged = await storageUserGet() //busca as inf do usuario logado
            const { token } = await storageAuthTokenGet()//busca as inf do token

            if (token && userLogged) { // se tiver token e usuario
                userAndTokenUpdate(userLogged, token);//coloque as inf do mesmo
            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false); //dps q tiver logado tira o loading
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove()//remove o usuario
            await storageAuthTokenRemove();//remove o token
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {// atualiza as inf
        loadUserData()
    }, [])

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);

        return () => {
            subscribe();
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            singIn,
            isLoadingUserStorageData,
            updateUserProfile,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}