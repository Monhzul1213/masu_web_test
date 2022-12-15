import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';

export const PDF = () => (
  <Document style={{height: 120}}>
    <Page>
      <View>
        <Text>test pdf</Text>
      </View>
    </Page>
  </Document>
);