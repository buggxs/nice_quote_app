import React, { Component } from 'react';
import { StyleSheet, Platform, SafeAreaView, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';


export default class App extends Component {
  state = { index: 0, showNewQuoteScreen: false, quotes: [] };


  _loadData = async () => {
    let value = await AsyncStorage.getItem('QUOTES');
    if(value != null) {
      value = JSON.parse(value);
      this.setState({quotes: value});
    }
  }


  _storeData(quotes) {
      AsyncStorage.setItem('QUOTES', JSON.stringify(quotes));
  }


  _addQuote = (text, author) => {
    let { quotes } = this.state;

    if(text && author){
      quotes.push({ text, author });
      this._storeData(quotes);
    } 

    this.setState({ index: quotes.length-1, showNewQuoteScreen: false, quotes: quotes });
  }


  _addQuote = () => {
    let { index, quotes } = this.state;
    quotes.splice(index, 1);
    this._storeData(quotes);
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
    if (prevIndex <= 0) prevIndex = quotes.length - 1;
    this.setState({index: prevIndex})
  }


  componentDidMount() {
    this._loadData();
  }


  render() {
    let { index, quotes } = this.state;
    const quote = quotes[index];

    return (
      <SafeAreaView style={styles.container}>
        
        <StyledButton style={styles.deleteQuoteButton} title="Löschen" onPress={ this._deleteQuote } />

        <StyledButton style={styles.newQuoteButton} title="Neu" onPress={() => this.setState({showNewQuoteScreen: true})} />

        <NewQuote visible={this.state.showNewQuoteScreen} onSave={ this._addQuote }/>
          
        {quote === undefined ? (
            <Text style={{fontSize: 36}}>Keine Zitate</Text>
          ) : (
            <Quote text={quote.text} author={quote.author} />
        )}
        
        <StyledButton style={styles.nextQuoteButton} title="Nächstes Zitat" onPress={ this._displayNextQuote } />

        <StyledButton style={styles.prevQuoteButton} title="Vorheriges Zitat" onPress={ this._displayPrevQuote } />

      </SafeAreaView>
    );
  }
}


function StyledButton(props) {
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
