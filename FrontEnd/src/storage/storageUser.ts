import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from '@dtos/UserDTO';
import { USER_STORAGE } from '@storage/storageConfig';

export async function storageUserSave(user: UserDTO) {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))//salva as inf do usuario
}

export async function storageUserGet() { // ver se o usuario esta logado
    const storage = await AsyncStorage.getItem(USER_STORAGE); // se tiver user dentro da memoria

    const user: UserDTO = storage ? JSON.parse(storage) : {}; // vc manda no formato se nao manda vazio

    return user
}

export async function storageUserRemove() {
    await AsyncStorage.removeItem(USER_STORAGE); // remover o usuario parte de logout
}