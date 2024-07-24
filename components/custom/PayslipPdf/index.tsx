import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const PayslipPdf = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Name</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
          <Text>Section #1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPdf;
