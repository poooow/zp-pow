import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import styles from '../../styles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

export default class SongScreen extends React.Component {

    render() {
        const params = this.props.navigation.state.params;

        const styleHTML = `<style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');
        html, body {
            padding: 0;
            margin: 0;
        }
        
        body {
            display: flex;
        }

        .container {
            font-family: 'Roboto Mono', monospace;
            font-size: 90%;
            line-height: 2.5em;
            padding: 1rem;
            flex-grow: 1;
        }

        .row {
            position: relative;
        }

        .chord {          
            position: absolute;
            margin-top: -0.5em;
            font-size: 80%;
            font-weight: 700;
            color: #ffffff;
            background-color: #00000088;
            padding: 0.2em 0.3em;
            border-radius: 0.3em;
            line-height: 1em;
        }

        .verseNumber {
            font-weight: 700;
            background-color: #ffffff;
            padding-right: 0.5em;
        }

        .verseNumber::after {
            content:"";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1.2em;
            border-top: 1px solid #00000033;
            z-index: -1;
        }
        </style>`;

        const styleHTMLDark = `<style type="text/css">
        .container {
            background-color: #000000;
            color: #ffffff;
        }

        .chord {          
            color: #000000;
            background-color: #ffffff88;
        }

        .verseNumber {
            background-color: #000000;
        }
        </style>`;

        params.html = params.text.replace(/(.+)/g, '<div class="row">$1</div>')
            .replace(/\[(.{1,7}?)\]/g, '<span class="chord">$1</span>')
            .replace(/(?:\r\n|\r|\n)/g, '\n')
            .replace(/<\/span>\\W*<span>/g, '&nbsp;')
            .replace(/(\.|=)(R[0-9]{0,2}|Ref|Rf|\*|[0-9]{1,2})(\.:|\.|:)/g, '<span class="verseNumber">$2</span>');

        params.html = '<meta name="viewport" content="width=device-width, initial-scale=1">'
            + styleHTML + (params.darkMode ? styleHTMLDark : '') + '<div class="container">' + params.html + '</div>';

        return (
            <View style={[styles.container, { backgroundColor: params.darkMode ? '#000' : '#fff' }]}>
                <View style={styles.songHeader}>
                    <TouchableOpacity style={styles.icon} onPress={() => this.props.navigation.goBack()}>
                        <Icon name="angle-left" size={40} style={{ color: params.darkMode ? '#fff' : '#000' }} />
                    </TouchableOpacity>
                    <View style={styles.songHeaderTitle}>
                        <Text style={[styles.title, { color: params.darkMode ? '#fff' : '#000' }]}>{params.title}</Text>
                        <Text style={[styles.subtitle, { color: params.darkMode ? '#fff' : '#000' }]}>{params.groupname}</Text>
                    </View>
                </View>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: params.html }}
                    style={{ width: '100%', resizeMode: 'cover', flex: 1 }}
                />
            </View>
        );
    }
}

SongScreen.navigationOptions = {
    title: 'Song',
};
