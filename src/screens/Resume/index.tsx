import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import {
    Container, 
    Header, 
    Title, 
    Content,
    ChartContent,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer

} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../Utils/categories';
import { useAuth } from '../../hooks/auth';

interface TransactionData {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}


export function Resume(){
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();
    const {user} = useAuth();

    function handleDateChange(action: 'next' | 'prev'){
        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        } else {
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const  expensives = responseFormatted
        .filter((expensive: TransactionData) => 
            expensive.type === 'down' && 
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
        );

        const expensivesTotal = expensives
        .reduce((acc: number, expensive: TransactionData) => {
            return acc + Number(expensive.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0
            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });

            if(categorySum > 0){
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                });
            }

        })

        setTotalByCategories(totalByCategory);
        setIsLoading(false);

    }

    useEffect(() => {
        loadData();
    }, [selectedDate]);
    
    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return(
        <Container>
        
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>

            {
            isLoading ?  
            <LoadContainer>
                <ActivityIndicator 
                    color={theme.colors.primary}
                    size="large"
                /> 
            </LoadContainer> :
            
            <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight(),
            }}
            >

                <MonthSelect>
                    <MonthSelectButton
                        onPress={() => handleDateChange('prev')}
                    >
                        <MonthSelectIcon
                            name="chevron-left"
                        />
                    </MonthSelectButton>

                    <Month>
                        {format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                    </Month>

                    <MonthSelectButton
                        onPress={() => handleDateChange('next')}
                    >
                        <MonthSelectIcon
                            name="chevron-right"
                        />
                    </MonthSelectButton>
                </MonthSelect>


                <ChartContent>
                    <VictoryPie
                        data={totalByCategories}
                        x="percent"
                        y="total"
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        labelPosition='centroid'
                    />
                </ChartContent>

                {
                    totalByCategories.map(item => 
                        <HistoryCard
                            key={item.key}
                            title={item.name}
                            amount={item.totalFormatted}
                            color={item.color}
                        />
                    )                
                }

            </Content>
        }
            
        </Container>
    )
}