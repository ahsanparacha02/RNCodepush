/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import CodePush from 'react-native-code-push';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [updateText, setUpdateText] = useState('');
  const [progress, setProgress] = useState(0);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    sync = async () => {
      CodePush.notifyAppReady();
      const update = await CodePush.checkForUpdate();

      if (update) {
        syncCodePush();
      }
    };
  }, []);
  const syncCodePush = () => {
    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: false},

      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
    CodePush.allowRestart();
  };
  const codePushStatusDidChange = status => {
    switch (status) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setUpdateText('Checking for updates.');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setUpdateText('Downloading package.');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setUpdateText('Installing update.');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setUpdateText('Up-to-date.');
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setUpdateText('Update installed.');
        break;
    }
  };
  const codePushDownloadDidProgress = event => {
    try {
      setProgress((event.receivedBytes / event.totalBytes).toFixed(2) * 100);
    } catch (error) {
      console.log(`Download Build progress error : ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>{updateText}</Text>
          <Text>Progress: {progress}% </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
};
export default CodePush(codePushOptions)(App);
