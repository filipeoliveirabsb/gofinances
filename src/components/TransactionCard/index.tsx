import React, {useEffect} from 'react';
import { categories } from '../../Utils/categories';

import { 
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date 
} from './styles';

export interface TransactionCardProps {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}



export function TransactionCard({ data } : Props){
    console.log(data);

    const [ category ] = categories.filter(
        item => item.key === data.category
    );

    return (
        <Container>
            <Title>
                {data.name}
            </Title>
            <Amount type={data.type}>
                {data.type === 'down' && '- '}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon}/>
                    <CategoryName>
                        {category.name}
                    </CategoryName>
                </Category>
                <Date>
                    {data.date}
                </Date>
            </Footer>
        </Container>
    )
}