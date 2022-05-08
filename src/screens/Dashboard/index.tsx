import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
;import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
    Container,
    Header, 
    HighlightCards, 
    Icon, 
    Photo, 
    Title, 
    Transactions, 
    TransactionsList, 
    User, 
    UserGreeting, 
    UserInfo, 
    UserName, 
    UserWraper,
    LogoutButton,
    LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps{
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}
interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'up' | 'down'
        ){
        const lastTransaction = 
        new Date(
        Math.max.apply(Math, collection
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())
        ));

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`;
    }

    async function loadTransaction() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensivesTotal = 0;

        const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
            if(item.type === 'up'){
                entriesTotal += Number(item.amount);
            } else {
                expensivesTotal += Number(item.amount);
            }

            let amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            amount = amount.replace('R$', 'R$ ');
            
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        });

        setTransactions(transactionFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'up');
        const lastTransactionsExpensives = getLastTransactionDate(transactions, 'down');

        const totalInterval = `01 a ${lastTransactionsEntries}`;
        const total = entriesTotal - expensivesTotal;

        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensives: {
                amount: expensivesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${lastTransactionsExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            },
        });

        setIsLoading(false);
    }

    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    
    return (
        <Container>
            { 
                isLoading ?  
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    /> 
                </LoadContainer> :
                <>
                    <Header>

                    <UserWraper>
                        <UserInfo>
                            <Photo 
                                source={{ 
                                    uri: "https://avatars.githubusercontent.com/u/65576264?v=4",
                                    
                                }}
                                />
                            <User>
                                <UserGreeting>Olá, </UserGreeting>
                                <UserName>Fulano</UserName>
                            </User>
                        </UserInfo>
                        
                        <LogoutButton onPress={()=> {}}>
                            <Icon name='power'/>        
                        </LogoutButton>
                    </UserWraper>

                    </Header>
                    <HighlightCards>
                        <HighlightCard 
                            type="up"
                            title="Entradas"
                            amount={highLightData.entries.amount}
                            lastTransaction={highLightData.entries.lastTransaction}
                        />
                        <HighlightCard
                            type="down"
                            title="Saídas"
                            amount={highLightData.expensives.amount}
                            lastTransaction={highLightData.expensives.lastTransaction}
                            />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highLightData.total.amount}
                            lastTransaction={highLightData.total.lastTransaction}
                        />
                    </HighlightCards>
                    <Transactions>
                        <Title>Listagem</Title>
                        <TransactionsList
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard data={item}/> }
                            
                        />
                    
                    </Transactions>
                </>
            }
        </Container>
    );
}