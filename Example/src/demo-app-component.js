import React, {Component} from 'react';
import {PagedContacts} from 'react-native-paged-contacts';
import {SafeAreaView, FlatList} from 'react-native';
import {View, Text, LoaderScreen, Colors,Button} from 'react-native-ui-lib';//eslint-disable-line
import {exampleContact} from './example-contact';


export default class DemoApp extends Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      loading: true,
      actualCount: 0,
      count: 'unknown'
    };

    this.pagedContacts = new PagedContacts();
  }

  componentDidMount() {
    this.getContacts();
  }

  async getContacts() {
    const granted = await this.pagedContacts.requestAccess();
    if (granted) {
      const count = await this.pagedContacts.getContactsCount();
      this.setState({
        count: count
      });

      const contacts = [];

      for (let i=0; i< count; i+=100) {
        const newContacts = await this.pagedContacts.getContactsWithRange(i, 100, [PagedContacts.displayName, PagedContacts.phoneNumbers]);
        contacts.push(...newContacts);
        this.setState({actualCount: contacts.length});
      }

      let list = contacts.map(x => {
        return {
          key: x.identifier,
          label: x.displayName,
        };
      });
      this.setState({
        data: list,
        loading: false,
      });
    } else {
      console.warn('Permissions issue');
    }
  }

  addContact = () => {
    this.pagedContacts.addContact(exampleContact);
  };

  render() {
    const {data} = this.state;
    if (data === undefined) {
      return this.renderLoading();
    }
    return this.renderList();
  }

  renderList() {
    const {data, count, actualCount} = this.state;
    return (
      <SafeAreaView>
        <Text style={{fontWeight: 'bold'}}>Found {actualCount}, expected {count} contacts</Text>
        <FlatList
          data={data}
          renderItem={({item}) => <Text>{item.label}</Text>}
        />
        <View>
          <Button onPress={this.addContact} label="Add new Contact" />
        </View>
      </SafeAreaView>
    );
  }

  renderLoading() {
    const {loading, animationConfig, actualCount, count} = this.state;
    return (
      <View flex bg-orange70 center>
        {loading &&
        <LoaderScreen
          color={Colors.blue60}
          message={"Loading... " + actualCount + '/' + count}
          overlay
          {...animationConfig}
        />}
      </View>
    );
  }
}
