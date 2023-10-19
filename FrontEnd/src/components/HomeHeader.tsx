import { TouchableOpacity } from 'react-native';
import { Heading, HStack, Text, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { UserPhoto } from './UserPhoto';
import { useAuth } from '@hooks/useAuth';
import defaulUserPhotoImg from '@assets/userPhotoDefault.png';
import { api } from '@services/api';

export function HomeHeader() {

    const { user, signOut } = useAuth()

    return (
        <HStack bg='gray.600' pt={16} pb={5} px={8} alignItems='center'>
            <UserPhoto
                source={
                    user.avatar
                        ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                        : defaulUserPhotoImg
                } size={16}
                alt="Imagem do usuário"
                mr={4}
            />
            <VStack flex={1}>
                <Text color="gray.100" fontSize='md'>
                    Olá,
                </Text>

                <Heading color="gray.100" fontSize="md" fontFamily="heading">
                    {user.name}
                </Heading>
            </VStack>

            <TouchableOpacity onPress={signOut}>
                <Icon
                    as={MaterialIcons}//biblioteca de img
                    name="logout"
                    color="gray.200"
                    size={7}
                />
            </TouchableOpacity>
        </HStack>
    );
}