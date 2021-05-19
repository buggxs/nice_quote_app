import React, { Component } from 'react';
import { Alert, StyleSheet, Platform, SafeAreaView, View, Text, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';


const database = SQLite.openDatabase('quotes.db');



export default class App extends Component {
  state = { index: 0, showNewQuoteScreen: false, quotes: [] };


  _loadData = async () => {
    database.transaction(
      transaction => transaction.executeSql(
        'SELECT * FROM quotes', 
        [], 
        (_, result) => this.setState({quotes: result.rows._array})
        )
    );
  }


  _saveQuoteToDB = (text, author, quotes) => {
    database.transaction(
      transaction => transaction.executeSql(
        'INSERT INTO quotes (text, author) VALUES (?, ?)', 
        [text, author], 
        (_, result) => quotes[quotes.length - 1].id = result.insertId
      )
    );
  }


  _deleteQuoteFromDB = (id) => {
    database.transaction(
      transaction => transaction.executeSql(
        'DELETE FROM quotes WHERE id = ?', 
        [id]
      )
    );
  }


  _addQuote = (text, author) => {
    let { quotes } = this.state;
    if(text && author){
      quotes.push({ text, author });
      this._saveQuoteToDB(text, author, quotes);
    } 
    this.setState({ index: quotes.length-1, showNewQuoteScreen: false, quotes: quotes });
  }


  _deleteButton = () => {
    Alert.alert(
      'Zitat löschen?', 
      'Das Zitat wird unwiederruflich gelöscht.', 
      [
        {text: 'HALT, abbrechen..', style: 'cancel'},
        {text: 'Ja, weg damit!', style: 'destructive', onPress: this._deleteQuote}
      ]);
  }


  _deleteQuote = () => {
    // TODO: Zitat aus der Datenbank löschen
    let { index, quotes } = this.state;
    this._deleteQuoteFromDB(quotes[index].id);
    quotes.splice(index, 1);
    this.setState({ index: 0, quotes: quotes });
  }


  _displayNextQuote = () => {
    let { index, quotes } = this.state;
    let nextIndex = index + 1;
    if (nextIndex === quotes.length) nextIndex = 0;
    this.setState({index: nextIndex})
  }


  _displayPrevQuote = () => {
    let { index, quotes } = this.state;
    let prevIndex = index - 1;
    if (prevIndex < 0) prevIndex = quotes.length - 1;
    this.setState({index: prevIndex})
  }


  componentDidMount() {
    /*
CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY NOT NULL, text TEXT, author TEXT);
*/
    database.transaction(
      transaction => transaction.executeSql("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY NOT NULL, text TEXT, author TEXT);")
    );
    this._loadData();
  }


  render() {
    let { index, quotes } = this.state;
    const quote = quotes[index];

    return (
      <SafeAreaView style={styles.container}>
        
        <StyledButton style={styles.deleteQuoteButton} title="Löschen" onPress={ this._deleteButton } visible={quote !== undefined} />

        <StyledButton style={styles.newQuoteButton} title="Neu" onPress={() => this.setState({showNewQuoteScreen: true})} visible={true} />

        <NewQuote visible={this.state.showNewQuoteScreen} onSave={ this._addQuote }/>
          
        {quote === undefined ? (
            <Text style={{fontSize: 36}}>Keine Zitate</Text>
          ) : (
            <Quote text={quote.text} author={quote.author} />
        )}
        
        <StyledButton style={styles.nextQuoteButton} title="Nächstes Zitat" onPress={ this._displayNextQuote } visible={quotes.length > 1} />

        <StyledButton style={styles.prevQuoteButton} title="Vorheriges Zitat" onPress={ this._displayPrevQuote } visible={quotes.length > 1} />

      </SafeAreaView>
    );
  }
}


function StyledButton(props) {
  if(!props.visible) {
    return null;
  }
  return (
    <View style={props.style}>
      <Button 
        title={props.title}
        onPress={props.onPress} 
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextQuoteButton: {
    position: 'absolute', 
    bottom: Platform.OS === 'ios' ? 20 : 20, // Platform abhängiges stylen
    left: 10
  },
  prevQuoteButton: {
    position: 'absolute',
    bottom: 20, 
    right: 10
  },
  newQuoteButton: {
    position: 'absolute',
    right: 10,
    top: 50
  },
  deleteQuoteButton: {
    position: 'absolute',
    left: 10,
    top: 50
  },
});
