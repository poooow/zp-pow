import React from 'react';
import { Button, FlatList, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../../styles.js';
import HTMLView from 'react-native-htmlview';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import SvgUri from "expo-svg-uri";

const XML_URL = 'https://kkns.eu/inet.xml';
const db = SQLite.openDatabase('DbZpevnikator4');
const parseString = require('react-native-xml2js').parseString;

export default class SearchScreen extends React.Component {

    constructor(props) {
        super(props);

        let existsDb = this.existsDb();

        let appState = null;
        if (!existsDb) {
            appState = 'Zpěvník je prázdný';
        }

        this.state = {
            dbExists: existsDb,
            songList: [],
            appState: appState,
            darkMode: false,
            fontLoaded: false
        };
    }

    async componentDidMount() {
        if (this.state.dbExists) this.updateSongList();
        this._loadAssetsAsync();
    }

    _loadAssetsAsync = async () => {
        await Font.loadAsync({
            RobotoSlab: require("../../assets/fonts/RobotoSlab-Medium.ttf"),
        });
        this.setState({ fontLoaded: true });
    };

    existsDb = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT 1 FROM zpevnikator LIMIT 1;', [], () => {
                this.setState({
                    dbExists: true,
                    appState: null
                });
                return true;
            }, () => {
                this.setState({
                    dbExists: false,
                    appState: 'Zpěvník je prázdný'
                });
                return false;
            });
        });
    };

    purgeDb = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE zpevnikator;');
        }, null, () => {
            this.setState({
                dbExists: false,
                appState: 'Zpěvník je prázdný'
            });
        });
    }

    createDb = () => {
        db.transaction(tx => {
            tx.executeSql('CREATE VIRTUAL TABLE IF NOT EXISTS zpevnikator USING fts4(id INTEGER PRIMARY KEY AUTOINCREMENT, groupname TEXT, title TEXT, text TEXT, textclean TEXT, tokenize=unicode61);', [], (tx, results) => {
            }, (tx, error) => {
                this.setState({ appState: error });
            });
        }, null, (status) => {
            this.setState({ dbExists: true });
        });
    }

    populateDb = (data) => {
        let song = data.InetSongDb.song;

        db.transaction(tx => {
            for (let i = 0; i < song.length; i++) {

                let groupname = song[i].groupname.toString().replace(/\"/g, '&quot;').replace(/\"/g, '&quot;');
                let title = song[i].title.toString().replace(/\"/g, '&quot;');
                let text = song[i].songtext.toString().replace(/\"/g, '&quot;');
                let textclean = text.replace(/\[(.{1,7}?)\]/g, '');

                tx.executeSql('INSERT INTO zpevnikator (groupname, title, text, textclean) VALUES (?,?,?,?)', [groupname, title, text, textclean],
                    null, error => {
                        this.setState({ appState: error });
                    });
            }
        }, error => {
            this.setState({ appState: error });
        }, () => {
            this.setState({ appState: null });
        });
    }

    /**
     * Get songs from database to state
     * @param search search string
     */
    updateSongList = (search) => {

        search = '*' + search + '*'

        let songList = [];

        db.transaction(tx => {
            tx.executeSql('SELECT groupname,title,text,snippet(zpevnikator, "<b>", "</b>","...", 4, 10) AS snippet FROM zpevnikator WHERE zpevnikator MATCH ? LIMIT 42',
                [search],
                (tx, results) => {
                    for (let i = 0; i < results.rows.length; ++i) {
                        songList.push({
                            id: i.toString(),
                            groupname: results.rows.item(i).groupname,
                            title: results.rows.item(i).title,
                            text: results.rows.item(i).text,
                            snippet: results.rows.item(i).snippet
                        })
                    }
                    this.setState({ songList: songList });
                });
        });
    }

    getXML = async () => {
        let xml = await fetch(XML_URL);
        return await xml.text();
    }

    parseXML(xml) {
        let json = '';
        parseString(xml, function (err, result) {
            json = result;
        });
        return json;
    }

    loadDb = async () => {
        this.createDb();

        this.setState({ appState: 'Nahrávám zpěvník ...' });

        let xml = '';
        try {
            xml = await this.getXML();
        } catch (error) {
            this.setState({ appState: error });
        }

        let json = this.parseXML(xml);

        if (json) {
            this.setState({ appState: 'Zpracovávám zpěvník ...' });
            this.populateDb(json);
        } else {
            this.purgeDb();
            this.setState({
                appState: 'Nepodařilo se stáhnout zpěvník',
            });
        }

        this.updateSongList();
    }

    toggleDarkMode = () => {

        let newState = !this.state.darkMode;

        this.setState({
            darkMode: newState,
        });
    };

    renderLoadDbButton = () => {
        return (
            <TouchableOpacity onPress={this.loadDb}>
                <SvgUri style={styles.iconDownload} width="150" height="150" source={require("../../assets/images/icon_download.svg")} />
                <Text style={[styles.loadDb, { color: this.state.darkMode ? '#fff' : '#000' }]}>Nahrát zpěvník{"\n"} z internetu (13 MB)</Text>
            </TouchableOpacity>
        );
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() =>
                this.props.navigation.navigate('Song', {
                    groupname: item.groupname,
                    title: item.title,
                    text: item.text,
                    darkMode: this.state.darkMode,
                })}>
                <View style={[styles.item, { backgroundColor: this.state.darkMode ? '#000' : '#fff' }]}>
                    <Text style={[styles.title, { color: this.state.darkMode ? '#fff' : '#000' }]}>{item.title}</Text>
                    <Text style={[styles.subtitle, { color: this.state.darkMode ? '#fff' : '#000' }]}>{item.groupname}</Text>
                    <HTMLView
                        value={'<div>' + item.snippet.replace(/\n/g, "") + '</div>'}
                        stylesheet={stylesHTML}
                    />
                </View>
            </TouchableOpacity>

        );
    }

    render() {

        if (!this.state.fontLoaded) {
            return (
                <AppLoading />
            )
        } else {
            return (
                <View style={[styles.container, { backgroundColor: this.state.darkMode ? '#000' : '#fff' }]}>
                    <MenuProvider>
                     {/*<Button
                        onPress={this.purgeDb}
                        title="Smazat databázi"
                        color="#841584"
                    />
                    <Button
                    onPress={this.existsDb}
                    title="exists databázi"
                    color="#841584"
                />*/}
                        <View style={styles.searchHeader}>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => this.updateSongList(text)}
                                placeholder="Hledat autora, písničku, nebo část textu"
                                placeholderTextColor="#99999955"
                            />
                            <Menu style={styles.menu}>
                                <MenuTrigger>
                                    <Text
                                        style={[styles.menuTrigger, { color: this.state.darkMode ? '#666' : '#ccc' }]}>&#x22EE;</Text>
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => this.toggleDarkMode()}>
                                        <Text style={styles.menuItem}>{this.state.darkMode ? 'Zrušit ' : ''}Noční režim</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        </View>

                        {this.state.appState || !this.state.dbExists ?
                            <View style={styles.stateContainer}>
                                {this.state.appState ? <Text style={[styles.appState, { color: this.state.darkMode ? '#666' : '#ccc' }]}>{this.state.appState}</Text> : null}
                                {this.state.dbExists ? null : this.renderLoadDbButton()}
                            </View>
                            : null}
                        {this.state.dbExists ?
                            <View>
                                <FlatList
                                    keyboardShouldPersistTaps={'handled'}
                                    keyExtractor={(item) => item.id}
                                    data={this.state.songList}
                                    renderItem={this.renderItem}
                                />
                            </View>
                            : null}
                        {this.state.appState == null && !this.state.songList.length ?
                            <View style={styles.stateContainer}>
                                <SvgUri width="100" height="100" source={require("../../assets/images/icon_arrow_up.svg")} />
                                <Text></Text>
                                <Text style={styles.appState}>Můžete začít hledat</Text>
                            </View>
                            : null}
                        {this.state.appState == null && !this.state.songList.length ?
                            <View style={styles.imageGiraffe}><SvgUri width="250" height="250" source={require("../../assets/images/giraffe.svg")} /></View>
                            : null}
                    </MenuProvider>
                </View>
            );
        }
    }
}

SearchScreen.navigationOptions = {
    title: 'Search',
};

const stylesHTML = StyleSheet.create({
    div: {
        color: '#888888'
    },
    b: {
        backgroundColor: '#fffb1f44',
        borderRadius: 8,
    },
});