import React from 'react';
import { Button, FlatList, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import styles from '../../styles.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

const XML_URL = 'https://kkns.eu/inet.xml';
const db = SQLite.openDatabase('DbZpevnikator');
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
            appState: appState
        };
    }

    componentDidMount() {
        if (this.state.dbExists) this.updateSongList();
    }

    /**
     * Get songs from database to state
     * @param search search string
     */
    updateSongList = (search) => {

        search = '*' + search + '*'

        let songList = [];

        db.transaction(tx => {
            /*tx.executeSql('SELECT * FROM zpevnikator WHERE LOWER(group_name) LIKE ? OR LOWER(title) LIKE ? OR LOWER(text) LIKE ? LIMIT 99', 
            [search?`%${search}%`:`%`, search?`%${search}%`:`%`, search?`%${search}%`:`%`], */
            tx.executeSql('SELECT groupname,title,text,snippet(zpevnikator, "<b>", "</b>","...", -1, 10) AS snippet FROM zpevnikator WHERE groupname MATCH ? OR title MATCH ? OR text MATCH ? LIMIT 99',
                [search, search, search],
                (tx, results) => {
                    for (i = 0; i < results.rows.length; ++i) {
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
                    appState: 'Zpěvník je prázdny'
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
                appState: 'Zpěvník je prázdny'
            });
        });
    }

    createDb = () => {
        db.transaction(tx => {
            tx.executeSql('CREATE VIRTUAL TABLE IF NOT EXISTS zpevnikator USING fts4(id INTEGER PRIMARY KEY AUTOINCREMENT, groupname TEXT, title TEXT, text TEXT, tokenize=unicode61);', [], (tx, results) => {
                //tx.executeSql('CREATE TABLE IF NOT EXISTS zpevnikator (id INTEGER PRIMARY KEY AUTOINCREMENT, group_name TEXT, title TEXT, text TEXT);', [], (tx, results) => {
            }, (tx, error) => {
                this.setState({ appState: error });
            });
        }, null, (status) => {
            this.setState({ dbExists: true });
        });
    }

    populateDb = (data) => {
        //let song = data.zpevnik_data.database[0].song;
        let song = data.InetSongDb.song;

        db.transaction(tx => {
            for (i = 0; i < song.length; i++) {

                let groupname = song[i].groupname.toString().replace(/\"/g, '&quot;').replace(/\"/g, '&quot;');
                let title = song[i].title.toString().replace(/\"/g, '&quot;');
                let text = song[i].songtext.toString().replace(/\"/g, '&quot;');

                tx.executeSql('INSERT INTO zpevnikator (groupname, title, text) VALUES (?,?,?)', [groupname, title, text],
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
            this.setState({ appState: 'Ukládám zpěvník ...' });
            this.populateDb(json);
        } else {
            this.purgeDb();
            this.setState({
                appState: 'Nepodařilo se stáhnout zpěvník',
            });
        }

        this.updateSongList();
    }

    renderLoadDbButton = () => {
        return (
            <TouchableOpacity onPress={this.loadDb}>
                <Icon style={styles.iconDownload} name="download" size={100} color="#000000" />
                <Text style={styles.loadDb}>Nahrát zpěvník z internetu (13 MB)</Text>
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
                })}>
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.groupname}</Text>
                    <HTMLView
                        value={'<div>' + item.snippet.replace(/\n/g, "") + '</div>'}
                        stylesheet={stylesHTML}
                    />
                </View>
            </TouchableOpacity>
            
        );
    }

    render() {
        return (
            <View style={styles.container}>
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
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.updateSongList(text)}
                    placeholder="Hledat autora, písničku, nebo část textu"
                    placeholderTextColor="#bbbbbb"
                />
                {this.state.appState || !this.state.dbExists ?
                    <View style={styles.stateContainer}>
                        {this.state.appState ? <Text style={styles.appState}>{this.state.appState}</Text> : null}
                        {this.state.dbExists ? null : this.renderLoadDbButton()}
                    </View>
                    : null}
                <View>
                    {this.state.dbExists ?
                        <FlatList
                            keyboardShouldPersistTaps={'handled'}
                            keyExtractor={(item) => item.id}
                            data={this.state.songList}
                            renderItem={this.renderItem}
                        />
                        : null}
                </View>
            </View>
        );
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
      backgroundColor: '#fffcb3',
      borderRadius: 8,
    },
  });