/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {Appearance} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import SplashScreen from 'react-native-splash-screen';

// screens
import AppContent from './AppContent';
import {StoreProvider, rootStore} from './models';

const colorScheme = Appearance.getColorScheme();

class App extends React.Component {
  routeNameRef: React.RefObject<any>;
  navigationRef: React.RefObject<any>;
  config: {screens: {Home: {path: string}}};
  linking: {
    prefixes: string[];
    config: {
      screens: {
        Home: {path: string};
      };
    };
  };
  constructor(props: any) {
    super(props);
    this.routeNameRef = React.createRef();
    this.navigationRef = React.createRef();
    this.config = {
      screens: {
        Home: {
          path: 'home',
        },
      },
    };
    this.linking = {
      prefixes: ['kiranatest://'],
      config: this.config,
    };
  }

  componentDidMount(): void {
    SplashScreen.hide();
  }

  render() {
    return (
      <StoreProvider value={rootStore}>
        <NativeBaseProvider>
          <NavigationContainer
            ref={this.navigationRef}
            linking={this.linking}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AppContent />
          </NavigationContainer>
        </NativeBaseProvider>
      </StoreProvider>
    );
  }
}

export default App;
