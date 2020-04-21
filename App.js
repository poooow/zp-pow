import React from "react";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SearchScreen from './src/screens/SearchScreen';
import SongScreen from './src/screens/SongScreen';

const AppNavigator = createStackNavigator(
    {
        Search: SearchScreen,
        Song: SongScreen,
    },
    {
        initialRouteName: 'Search',
        headerMode: 'none',
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
};
