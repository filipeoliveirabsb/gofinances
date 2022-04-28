import React, {useEffect, useState} from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard, 
    Alert 
} from 'react-native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

//import { Input } from '../../components/Forms/Input';
import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';


import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

/*  interface FormData {
     name: string;
     amount: string;
 }
 */
export type FormData = {
   [name: string]: any;
}

type NavigationProps = {
    navigate: (screen:string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number()
            .typeError('Informe um valor válido')
            .positive('O valor não pode ser negativo')
            
});


export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    /*     const [name, setName] = useState('');
    const [amount, setAmount] = useState(''); */

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const navigation = useNavigation<NavigationProps>();

    const {
        control, 
        handleSubmit,
        reset, 
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });
    
    function handleTransactionsTypeSelect(type: 'up' | 'down'){
        setTransactionType(type);
    }

    function handleOpenSelectCategory(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategory(){
        setCategoryModalOpen(false);
    }

    /* function handleRegister(){
        const data = {
            name,
            amount,
            transactionType,
            category: category.name
        }
        console.log(data);
    } */

    async function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação');
        }

        if (category.key === 'category'){
            return Alert.alert('Selecione a categoria');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
            const dataFormatted = [    //array de objetos, antigas mais a nova
                ...currentData,
                newTransaction
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));  
            
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar");
        }
    }

    /* useEffect(() => {
        const dataKey = '@gofinances:transactions';
        async function loadData() {
            const data = await AsyncStorage.getItem(dataKey);
            //console.log(data);
            console.log(JSON.parse(data!)); //! = recurso do TS -> sempre vai ter valor
        }

        loadData();
        async function removeAll(){
            await AsyncStorage.removeItem(dataKey);
        }

        removeAll(); 
    }, []);  */
 

    useEffect(() => {
        const dataKey = '@gofinances:transactions';
        async function loadData() {
            const data = await AsyncStorage.getItem(dataKey);
            //console.log(data);
            console.log(JSON.parse(data!)); //! = recurso do TS -> sempre vai ter valor
        }
        loadData();
    }, []);


    return(
        <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
        >
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                    {/*  <Input 
                        placeholder='Nome'
                        onChangeText={setName}
                        />
                        <Input 
                        placeholder='Preço'
                        onChangeText={setAmount}
                        /> */}

                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionsTypeSelect('up')}
                                isActive={transactionType === 'up'}
                            /> 
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionsTypeSelect('down')}
                                isActive={transactionType === 'down'}
                            />                
                        </TransactionsTypes>

                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategory}
                        />
                    </Fields>

                    <Button 
                        title='Enviar'
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCAtegory={setCategory}
                        closeSelectCategory={handleCloseSelectCategory}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}