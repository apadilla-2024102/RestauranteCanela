import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const WEB_PAGE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:5173'
  : 'http://127.0.0.1:5173';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        source={{ uri: WEB_PAGE_URL }}
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        scalesPageToFit={true}
        scrollEnabled={true}
        bounces={true}
        renderLoading={() => (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#d5395f" />
          </View>
        )}
        originWhitelist={["*"]}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(`HTTP error: ${nativeEvent.statusCode}`);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
