import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../styles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import SvgUri from "expo-svg-uri";

export default class SongScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            transposition: 0,
            params: this.props.navigation.state.params
        };

        this.makeHTML();
    }

    /**
    * Transpose chord base tone by given shift
    * @param  chord
    * @param  shift
    * @returns {string}
    */
    transpose(chord, shift) {

        const chords = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'BB', 'H'];

        if (!chords.includes(chord)) return chord; // Exclude unlisted chords

        let isLowerCase = (chord.toLowerCase() === chord); //If chord on input is lowercase, output has to be lowercase too
        if (shift < 0) {
            shift = (chords.length + shift) % chords.length;
        }
        let parts = chord.match(/^(.[#b]?)(.*)$/, chord);
        let base = parts[1]; //For C#maj7 it is "C#"
        let rest = parts[2]; //For C#maj7 it is "maj7"
        let index = chords.indexOf(base.toUpperCase());
        let newBase = chords[(index + shift) % chords.length]; //shifted base tone

        if (isLowerCase) {
            newBase = newBase.toLowerCase();
        } else if (newBase === 'BB') {
            newBase = 'Bb'; //this is special case, second 'b' has to be lowercase to make sense
        }

        return newBase + rest;
    }

    transposeUp = () => {
        this.setState({
            transposition: this.state.transposition + 1,
        }, () => this.makeHTML());
    };

    transposeDown = () => {
        this.setState({
            transposition: this.state.transposition - 1,
        }, () => this.makeHTML());
    };

    transposeReset = () => {
        this.setState({
            transposition: 0,
        }, () => this.makeHTML());
    };

    /** 
     * Returns transposed chord with html tag
     * @param chord 
     * @returns {string}
     */
    transposeHTML = (_, chord) => {
        return '<span class="chord">' + this.transpose(chord, this.state.transposition) + '</span>';
    }

     /** 
      * Transform song text to html for WebView
      */
    makeHTML = () => {

        let params = this.state.params;

        const styleHTML = `<style type="text/css">
        html, body {
            padding: 0;
            margin: 0;
        }
        
        body {
            display: flex;
        }

        .container {
            font-family:  monospace;
            font-size: 100%;
            line-height: 2.5em;
            padding: 1rem;
            flex-grow: 1;
            font-weight: 700;
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

        params.html = params.text.replace(/(.+)/g, '<div class="row">$1&nbsp;</div>')
            .replace(/\[([a-zA-Z0-9_#+-/()]{2}\])(.{1,2})(\[[a-zA-Z0-9_#+-/()]+)\]/g, '[$1$3]$2')
            .replace(/\[([a-zA-Z0-9_#+-/()]{3}\])(.{1,3})(\[[a-zA-Z0-9_#+-/()]+)\]/g, '[$1$3]$2')
            .replace(/\[([a-zA-Z0-9_#+-/()]{4}\])(.{1,4})(\[[a-zA-Z0-9_#+-/()]+)\]/g, '[$1$3]$2')
            .replace(/\[([a-zA-Z0-9_#+-/()]{5}\])(.{1,5})(\[[a-zA-Z0-9_#+-/()]+)\]/g, '[$1$3]$2')
            .replace(/\[([a-zA-Z0-9_#+-/()\s]+)\]/g, this.transposeHTML)
            .replace(/<\/span>\s*<span class="chord">/g, " ")
            .replace(/(?:\r\n|\r|\n)/g, '\n')
            .replace(/(\.|=)(R[0-9]{0,2}|Ref|Rf|\*|[0-9]{1,2})(\.:|\.|:)/g, '<span class="verseNumber">$2</span>');

        params.html = '<meta name="viewport" content="width=device-width, initial-scale=1">'
            + styleHTML + (this.state.params.darkMode ? styleHTMLDark : '') + '<div class="container">' + params.html + '</div>';

        this.setState({
            params: params,
        });
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.state.params.darkMode ? '#000' : '#fff' }]}>
                <View style={styles.songHeader}>
                    <TouchableOpacity style={styles.icon} onPress={() => this.props.navigation.goBack()}>
                        {this.state.params.darkMode ?
                            <SvgUri style={styles.iconBack} width="40" height="40" source={require("../../assets/images/btn_arrow_back_white.svg")} />
                            :
                            <SvgUri style={styles.iconBack} width="40" height="40" source={require("../../assets/images/btn_arrow_back.svg")} />
                        }
                    </TouchableOpacity>
                    <View style={styles.songHeaderTitle}>
                        <Text style={[styles.title, { color: this.state.params.darkMode ? '#fff' : '#000' }]}>{this.state.params.title}</Text>
                        <Text style={[styles.subtitle, { color: this.state.params.darkMode ? '#fff' : '#000' }]}>{this.state.params.groupname}</Text>
                    </View>
                    <View style={styles.songHeaderTransposition}>
                        <TouchableOpacity onPress={() => this.transposeDown()}>
                            {this.state.params.darkMode ?
                                <SvgUri width="30" height="30" source={require("../../assets/images/btn_arrow_down_white.svg")} />
                                :
                                <SvgUri width="30" height="30" source={require("../../assets/images/btn_arrow_down.svg")} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.transposeReset()}>
                            {this.state.params.darkMode ?
                                    <SvgUri width="16" height="30" source={require("../../assets/images/btn_note_white.svg")} />
                                    :
                                    <SvgUri width="16" height="30" source={require("../../assets/images/btn_note.svg")} />
                            }
                        </TouchableOpacity>
                        <View><Text style={[styles.shift, { color: this.state.params.darkMode ? '#fff' : '#000' }]}>{this.state.transposition ? (this.state.transposition < 0 ? this.state.transposition : "+" + this.state.transposition ) : null}</Text></View>
                        <TouchableOpacity onPress={() => this.transposeUp()}>
                            {this.state.params.darkMode ?
                                <SvgUri width="30" height="30" source={require("../../assets/images/btn_arrow_up_white.svg")} />
                                :
                                <SvgUri width="30" height="30" source={require("../../assets/images/btn_arrow_up.svg")} />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: this.state.params.html }}
                    style={{ width: '100%', resizeMode: 'cover', flex: 1 }}
                />
            </View>
        );
    }
}

SongScreen.navigationOptions = {
    title: 'Song',
};
