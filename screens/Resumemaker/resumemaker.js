import React from "react";
import { View, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Header2 } from "../../components";

const Resumemaker = () => {
  const handleShouldStartLoad = (event) => {
    const { url } = event;

    // Check if the URL ends with '.pdf'
    if (url.endsWith('.pdf')) {
      // Handle the PDF download here
      if (Platform.OS === 'android') {
        // For Android, you can use the DownloadManager to download the PDF
        // This is a simplified example, you may need to adjust it based on your specific needs
        const DownloadManager = require('react-native-download-manager');
        const config = {
          file: {
            description: 'Downloading PDF',
            title: 'MyResume.pdf',
            mimeType: 'application/pdf',
            notificationVisibility: DownloadManager.NotificationVisibility.VisibleNotifyCompleted,
          },
          network: true,
        };

        DownloadManager.download(url, config)
          .then((info) => {
            console.log('Download started with ID', info.downloadId);
          })
          .catch((error) => {
            console.error('Download failed with error', error);
          });

        // Prevent loading the PDF in the WebView
        return false;
      }

      // For iOS, you can open the URL in Safari or use other libraries for downloading
      // Adjust the logic based on your specific requirements for iOS
    }

    // Allow other URLs to be loaded in the WebView
    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      <Header2 />
      <WebView
        source={{ uri: "https://code-red-blush.vercel.app/" }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
      />
    </View>
  );
};

export default Resumemaker;
