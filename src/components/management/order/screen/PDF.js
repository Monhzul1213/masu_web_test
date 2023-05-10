import React from 'react';
import { Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { formatNumber } from '../../../../helpers';

export function PDF(){
  const { t } = useTranslation();
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';
  const fetchedData = JSON.parse(sessionStorage.getItem('order'));

  Font.register({ family: "Roboto", src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf" });
  Font.register({ family: "Roboto-Bold", src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf" });

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      paddingHorizontal: 25,
      paddingVertical: 30
    },
    order_no: {
      fontFamily: 'Roboto-Bold',
      fontSize: 18,
      marginBottom: 15
    },
    field: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 4
    },
    label: {
      fontFamily: 'Roboto-Bold',
      fontSize: 12,
    },
    value: {
      fontSize: 12,
    },
    col_back: {
      marginVertical: 20,
      display: 'flex',
      flexDirection: 'row',
    },
    col: {
      flex: 1
    },
    col_gap: {
      width: 30,
      height: 30
    },
    table_header: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 1,
      width: '100%',
      marginTop: 10,
      paddingBottom: 3
    },
    table_header_text1: {
      fontFamily: 'Roboto-Bold',
      fontSize: 11,
      width: '40%'
    },
    table_header_text2: {
      fontFamily: 'Roboto-Bold',
      fontSize: 11,
      width: '15%',
      textAlign: 'right'
    },
    table_header_text3: {
      fontFamily: 'Roboto-Bold',
      fontSize: 11,
      width: '20%',
      textAlign: 'right'
    },
    table_header_text4: {
      fontFamily: 'Roboto-Bold',
      fontSize: 11,
      width: '25%',
      textAlign: 'right',
    },
    table_row: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 2
    },
    table_row_text1: {
      fontSize: 11,
      width: '40%'
    },
    table_row_text2: {
      fontSize: 11,
      width: '15%',
      textAlign: 'right'
    },
    table_row_text3: {
      fontSize: 11,
      width: '20%',
      textAlign: 'right'
    },
    table_row_text4: {
      fontSize: 11,
      width: '25%',
      textAlign: 'right',
    },
    table_footer: {
      display: 'flex',
      flexDirection: 'row',
      borderTopWidth: 1,
      width: '100%',
      paddingTop: 3
    },
  });
  
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View>
          <Text style={styles.order_no}>{t('order.title')} {fetchedData?.poOrder?.orderNo}</Text>
          <View style={styles.field}>
            <Text style={styles.label}>{t('order.date')} : </Text>
            <Text style={styles.value}>{fetchedData?.poOrder?.orderDate}</Text>
          </View>
          {!fetchedData?.poOrder?.reqDate ? null :
          <View style={styles.field}>
            <Text style={styles.label}>{t('order.req')} : </Text>
            <Text style={styles.value}>{fetchedData?.poOrder?.reqDate}</Text>
          </View>}
          <View style={styles.field}>
            <Text style={styles.label}>{t('order.created')} : </Text>
            <Text style={styles.value}>{fetchedData?.poOrder?.createdUserName}</Text>
          </View>
        </View>
        <View style={styles.col_back}>
          <View style={styles.col}>
            <Text style={styles.label}>{t('order.vend')}:</Text>
            <Text style={styles.value}>{fetchedData?.poOrder?.vendName}</Text>
            {fetchedData?.poOrder?.vendAddress ? <Text style={styles.value}>{fetchedData?.poOrder?.vendAddress}</Text>: null}
            {fetchedData?.poOrder?.vendPhone ? <Text style={styles.value}>{fetchedData?.poOrder?.vendPhone}</Text>: null}
            {fetchedData?.poOrder?.vendEmail ? <Text style={styles.value}>{fetchedData?.poOrder?.vendEmail}</Text>: null}
          </View>
          <View style={styles.col_gap} />
          <View style={styles.col}>
            <Text style={styles.label}>{t('order.site')}:</Text>
            <Text style={styles.value}>{fetchedData?.poOrder?.siteName}</Text>
            {fetchedData?.poOrder?.siteAddress ? <Text style={styles.value}>{fetchedData?.poOrder?.siteAddress}</Text>: null}
            {fetchedData?.poOrder?.sitePhone ? <Text style={styles.value}>{fetchedData?.poOrder?.sitePhone}</Text>: null}
          </View>
        </View>
        <View style={styles.table_header}>
          <Text style={styles.table_header_text1}>{t('inventory.title')}</Text>
          <Text style={styles.table_header_text2}>{t('order.t_qty1')}</Text>
          <Text style={styles.table_header_text3}>{t('order.t_cost')}</Text>
          <Text style={styles.table_header_text4}>{t('order.t_total')}</Text>
        </View>
        {fetchedData?.poOrderItems?.map((item, index) => {
          return (
          <View key={'i' + index} style={styles.table_row}>
              <Text style={styles.table_row_text1}>{item?.invtName}</Text>
              <Text style={styles.table_row_text2}>{item?.orderTotalQty}</Text>
              <Text style={styles.table_row_text3}>{formatNumber(item?.cost)}{suffix}</Text>
              <Text style={styles.table_row_text4}>{formatNumber(item?.totalCost)}{suffix}</Text>
            </View>
          );
        })}
        {fetchedData?.poOrderAddCosts?.map((item, index) => {
          return (
          <View key={'a' + index} style={styles.table_row}>
              <Text style={styles.table_row_text1}>{item?.addCostName}</Text>
              <Text style={styles.table_row_text2}>1</Text>
              <Text style={styles.table_row_text3}>{formatNumber(item?.addCostAmount)}{suffix}</Text>
              <Text style={styles.table_row_text4}>{formatNumber(item?.addCostAmount)}{suffix}</Text>
            </View>
          );
        })}
        <View style={styles.table_footer}>
          <Text style={styles.table_header_text1}></Text>
          <Text style={styles.table_header_text2}></Text>
          <Text style={styles.table_header_text3}>{t('order.f_total')}</Text>
          <Text style={styles.table_header_text4}>{formatNumber(fetchedData?.poOrder?.total)}{suffix}</Text>
        </View>
      </Page>
    </Document>
  );
};