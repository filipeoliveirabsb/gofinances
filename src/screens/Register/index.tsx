import React, {useState} from 'react';
import { Modal } from 'react-native';

import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import {TransactionTypeButton} from '../../components/Forms/TransactionTypeButton';
import {CategorySelectButton} from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';


import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
 } from './styles';

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
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

    function handleRegister(){

    }

    return(
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <Input 
                    placeholder='Nome'
                    onChangeText={setName}
                    />
                    <Input 
                    placeholder='Preço'
                    onChangeText={setAmount}
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
                    onPress={handleRegister}
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
    );
}