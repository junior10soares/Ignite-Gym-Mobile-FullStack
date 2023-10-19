import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { useAuth } from '@hooks/useAuth';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormData = {
    email: string;
    password: string;
}

export function SignIn() {

    const [isLoading, setIsLoading] = useState(false)

    const { singIn, user } = useAuth();

    const toast = useToast();

    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>()

    function handleNewAccount() {
        navigation.navigate('signUp');
    }

    async function handleSignIn({ email, password }: FormData) {

        try {
            await singIn(email, password);
            setIsLoading(true)

        } catch (error) {
            const isAppError = error instanceof AppError;

            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
            setIsLoading(false)
        }
    }

    return (
        <ScrollView // p teclado n ficar em cima dos components
            contentContainerStyle={{ flexGrow: 1 }}//estica todo
            showsVerticalScrollIndicator={false}//sem a barra lateral de correr
        >
            <VStack flex={1} px={10}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas treinando"
                    resizeMode="contain"//melhora a posição da img
                    position="absolute"//tudo vai ficar em cima da img
                />

                <Center my={24}>
                    <LogoSvg />

                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo.
                    </Text>
                </Center>

                <Center>
                    <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
                        Acesse sua conta
                    </Heading>

                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: 'Informe o e-mail' }}
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"//mantem td minusculo
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Informe a senha' }}
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Senha"
                                secureTextEntry //esconder senha
                                onChangeText={onChange}
                            />
                        )}
                    />

                    <Button
                        title="Acessar"
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />

                    <Center mt={24}>
                        <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                            Ainda não tem acesso?
                        </Text>
                    </Center>
                    <Button
                        onPress={handleNewAccount}
                        title="Criar conta"
                        variant="outline"
                    />
                </Center>
            </VStack>
        </ScrollView>
    );
}