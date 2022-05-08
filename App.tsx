import React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { NavigationContainer} from '@react-navigation/native';
import { AppRoutes} from './src/routes/app.routes';

import { SignIn } from './src/screens/SignIn';

import { AuthProvider, useAuth } from './src/hooks/auth';
//import { CategorySelect } from './src/screens/CategorySelect';
//import { Register } from './src/screens/Register';
//import { Dashboard } from './src/screens/Dashboard';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading/>
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar barStyle="light-content"/>
          
          <AuthProvider>
            <SignIn/> 
          </AuthProvider>

        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}


