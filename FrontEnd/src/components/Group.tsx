import { Text, Pressable, IPressableProps } from 'native-base';

type Props = IPressableProps & {
    name: string;
    isActive: boolean
}

export function Group({ name, isActive, ...rest }: Props) {
    return (
        <Pressable // mesma coisa que o touchopacit porem sem o efeito de click
            mr={3}
            w={24}
            h={10}
            bg="gray.600"
            rounded="md" // border radius mesma coisa
            justifyContent="center"
            alignItems="center"
            overflow="hidden" //p oque tiver escrito ficar dentro do botao
            isPressed={isActive}// se tiver pressionado
            _pressed={{
                borderColor: 'green.500',
                borderWidth: 1
            }}
            {...rest}
        >
            <Text
                color={isActive ? "green.500" : "gray.200"}//se tiver press coloca a cor
                textTransform="uppercase"//sempre maisc
                fontSize="xs"
                fontWeight="bold"
            >
                {name}
            </Text>
        </Pressable>
    );
}