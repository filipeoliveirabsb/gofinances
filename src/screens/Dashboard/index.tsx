import React from 'react';

import {
    Container,
    Header, 
    Photo,
    User,
    UserGreeting, 
    UserInfo, 
    UserName
} from './styles';

export function Dashboard(){
    return (
        <Container>
            <Header>
                <UserInfo>
                    <Photo 
                        source={{uri:'https://avatars.githubusercontent.com/u/65576264?v=4'}}
                        
                    />
                    <User>
                        <UserGreeting>Olá, </UserGreeting>
                        <UserName>Fulano</UserName>
                    </User>
                </UserInfo>
            </Header>
        </Container>
    );
}