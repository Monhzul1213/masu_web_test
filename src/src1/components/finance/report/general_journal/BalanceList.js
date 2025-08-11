import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from './Filter';
import { Empty1 } from '../../../../../components/all';


export function JournalInquiry({ data, login_image }) {
  return (
    <div style={{ width: '280mm', background: 'white', padding: '10px 0', fontFamily: 'Tahoma, sans-serif' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse'}}>
        <tbody>
          <tr>
            <td colSpan={6}>
              <img
                src={`data:image/png;base64,${login_image?.fileData}`}
                alt="logo" style={{ maxWidth: '200px', height: '45px', display: 'block'}}
              />
            </td>
            <td colSpan={11} style={{ textAlign: 'right', fontSize: 12 }}>
              {data?.header?.merchantName}
            </td>
          </tr>
          <tr>
            <td colSpan={17} style={{ height: '15px' }} />
          </tr>
          <tr >
            <td colSpan={17} style={{
              textAlign: 'center',
              backgroundColor: '#4A55A2',
              color: '#fff',
              fontWeight: 'bold',
              padding: 8,
              fontSize: 14,
            }}>
              ГҮЙЛГЭЭ БАЛАНС
            </td>
          </tr>
          <tr style={{
            backgroundColor: '#EFF1F5',
            fontWeight: 'bold',
            fontSize: 11.5,
            color: '#4A55A2',
            borderBottom: '1px solid var(--root-color)'
        }}>
            <td rowSpan={2} colSpan={2} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Данс</td>
            <td rowSpan={2} colSpan={4} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Дансны нэр</td>
            <td rowSpan={2} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Валют</td>
            <td colSpan={2} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Эхний үлдэгдэл</td>
            <td colSpan={2} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Гүйлгээ</td>
            <td colSpan={6} style={{ textAlign: 'center', borderRight: '1px solid var(--root-color)' }}>Эцсийн үлдэгдэл</td>
        </tr>
        <tr style={{
            backgroundColor: '#EFF1F5',
            fontWeight: 'bold',
            fontSize: 11.5,
            color: '#4A55A2',
            borderBottom: '1px solid var(--root-color)'
        }}>
            <td style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Дебит</td>
            <td style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Кредит</td>
            <td style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Дебит</td>
            <td style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Кредит</td>
            <td colSpan={5} style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Дебит</td>
            <td style={{ textAlign: 'right', borderRight: '1px solid var(--root-color)' }}>Кредит</td>
        </tr>
          {data?.data?.map((group, i) => (
            <React.Fragment key={i}>
              <tr style={{ backgroundColor: '#F5F5F5', fontWeight: 'bold', fontSize: 10, color: '#4A55A2', borderBottom: '1px solid var(--line-color)' }}>
                <td colSpan={17}>{group.groupAcctParent}</td>
              </tr>

              {group.datas?.map((list, j) => (
                <React.Fragment key={j}>
                  <tr style={{ backgroundColor: '#F5F5F5', fontWeight: 'bold', fontSize: 10, color: '#4A55A2', borderBottom: '1px solid var(--line-color)' }}>
                    <td colSpan={1}/>
                    <td colSpan={16}>{list.groupAcct}</td>
                  </tr>

                  {list.data?.map((item, k) => (
                    <React.Fragment key={k}>
                      <tr style={{ fontSize: 10, height: '25px', borderBottom: '1px solid var(--line-color)'}}>
                        <td>{item.acct}</td>
                        <td colSpan={5}>{item.acctname}</td>
                        <td style={{ textAlign: 'center' }}>{item.curyID}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(item.bDrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(item.bCrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(item.drAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(item.crAmt)}</td>
                        <td colSpan={5} style={{ textAlign: 'right' }}>{formatNumber2(item.eDrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(item.eCrAmt)}</td>
                      </tr>

                      {item.curyID !== 'MNT' && (
                        <tr style={{ fontSize: 10 }}>
                          <td colSpan={6} style={{ textAlign: 'right' }}>валютаар</td>
                          <td colSpan={11} />
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                    <tr style={{ fontSize: 11, fontWeight: 'bold', height: '25px', backgroundColor: '#F5F5F5', borderBottom: '1px solid var(--line-color)', color: '#5C6476' }}>
                        <td colSpan={7}></td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(list.totalBdrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(list.totalBcrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(list.totalDrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(list.totalCrAmt)}</td>
                        <td colSpan={5} style={{ textAlign: 'right' }}>{formatNumber2(list.totalEdrAmt)}</td>
                        <td style={{ textAlign: 'right' }}>{formatNumber2(list.totalEcrAmt)}</td>
                    </tr>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
                <tr style={{ fontSize: 11, fontWeight: 'bold', backgroundColor: '#F5F5F5', height: '25px', borderBottom: '1px solid var(--line-color)', color: '#5C6476' }} >
                    <td colSpan={7} style={{ textAlign: 'left' }}><strong>Нийт</strong></td>
                    <td style={{ textAlign: 'right' }}>{formatNumber2(data.totalBDr)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber2(data.totalBCr)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber2(data.totalDr)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber2(data.totalCr)}</td>
                    <td colSpan={5} style={{ textAlign: 'right' }}>{formatNumber2(data.totalEDr)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber2(data.totalEcrAmt)}</td>
                </tr>
                <tr style={{height: 80}}></tr>
                <tr style={{height: 30, fontSize: 12,}}>
                    <td colSpan={9} style={{ textAlign: 'right' }}>Захирал:_________________________________________</td>
                    <td colSpan={8} >{data?.header?.director || ''}</td>
                </tr>
                <tr style={{height: 30, fontSize: 12,}}>
                    <td colSpan={9} style={{ textAlign: 'right' }}>Хөтөлсөн нягтлан бодогч: __________________________ </td>
                    <td colSpan={8} >{data?.header?.accountant || ''}</td>
                </tr>
        </tbody>
      </table>
    </div>
  );
}

export function BalanceList(props){
    const { data, date, setDate, type, onSearch, loading, error, size, image } = props;

    const balanceHtml = `
        <html>
        <head>
            <title>JournalInquiry</title>
            <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
            <style type="text/css">
                .csF9872371 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Microsoft Sans Serif'; font-size: 10px; font-weight:normal; font-style:normal; }
                .csB8C3774E {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs8EE453EA {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:6px;padding-bottom:4px;}
                .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
                .csCCCC758 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .cs5F549EA6 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:23px;padding-bottom:6px;}
                .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .csC7C9BB91 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs5720DF67 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .csB43E06EC {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; }
                .cs3F179B19 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .csDC191A99 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:6px;padding-right:4px;padding-bottom:4px;}
                .cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-right:9px;padding-bottom:6px;}
                .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; }
                .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
                .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size: 0px;line-height:0px;}
            </style>
        </head>
        <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
        <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:280mm;height:422px;position:relative;">
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td style="width:76px;"></td>
                <td style="width:37px;"></td>
                <td style="width:77px;"></td>
                <td style="width:114px;"></td>
                <td style="width:6px;"></td>
                <td style="width:57px;"></td>
                <td style="width:113px;"></td>
                <td style="width:113px;"></td>
                <td style="width:114px;"></td>
                <td style="width:113px;"></td>
                <td style="width:8px;"></td>
                <td style="width:27px;"></td>
                <td style="width:6px;"></td>
                <td style="width:42px;"></td>
                <td style="width:13px;"></td>
                <td style="width:18px;"></td>
                <td style="width:113px;"></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:16px;"></td>
                <td class="csF9872371" colspan="5" rowspan="3" style="width:350px;height:50px;text-align:left;vertical-align:top;">
                <div style="overflow:hidden;width:130px;height:45px;">
                    <img alt="" src=${`data:image/png;base64,${image?.fileData}`} style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" /></div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:22px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs6497CDF" colspan="5" style="width:192px;height:22px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${data?.header?.merchantName}</td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td class="csA719B1F9" colspan="17" style="width:1043px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ГҮЙЛГЭЭ&nbsp;БАЛАНС</nobr></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:25px;"></td>
                <td class="csB8C3774E" rowspan="2" style="width:71px;height:41px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Данс</nobr></td>
                <td class="csB8C3774E" colspan="4" rowspan="2" style="width:229px;height:41px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Дансны&nbsp;нэр</nobr></td>
                <td class="cs8EE453EA" rowspan="2" style="width:48px;height:41px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Валют</nobr></td>
                <td class="cs8EE453EA" colspan="2" style="width:217px;height:16px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Эхний&nbsp;үлдэгдэл</nobr></td>
                <td class="cs8EE453EA" colspan="2" style="width:218px;height:16px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Гүйлгээ</nobr></td>
                <td class="csCCCC758" colspan="7" style="width:219px;height:16px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Эцсийн&nbsp;үлдэгдэл</nobr></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:25px;"></td>
                <td class="cs8EE453EA" style="width:104px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:104px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" style="width:105px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:104px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" colspan="6" style="width:105px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:104px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
            </tr>
            ${data?.data?.map((el, index) => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td class="csF7EB0CA5" colspan="17" style="width:1043px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${el?.groupAcctParent}</td>
            </tr>
            ${el?.datas?.map((list, index) => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs5F549EA6" colspan="17" style="width:1024px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.groupAcct}</td>
            </tr>
            ${list?.data?.map((item, index) => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs3F179B19" style="width:72px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${item?.acct}</td>
                <td class="cs3F179B19" colspan="4" style="width:230px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${item?.acctname}</td>
                <td class="csDC191A99" style="width:49px;height:10px;text-align:center"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${item?.curyID}</td>
                <td class="csDC191A99" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.bDrAmt)}</td>
                <td class="csDC191A99" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.bCrAmt)}</td>
                <td class="csDC191A99" style="width:106px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.drAmt)}</td>
                <td class="csDC191A99" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.crAmt)}</td>
                <td class="csDC191A99" colspan="6" style="width:106px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.eDrAmt)}</td>
                <td class="csDC191A99" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.eCrAmt)}</td>
            </tr>
            ${item?.curyID !== 'MNT' ?
            `<tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs1E07F7AF" colspan="6" style="width:354px;height:10px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="csB43E06EC" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csB43E06EC" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csB43E06EC" style="width:106px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csB43E06EC" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csB43E06EC" colspan="6" style="width:106px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csB43E06EC" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>` : ''}`).join("")}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csC7C9BB91" colspan="6" style="width:363px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalBdrAmt)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalBcrAmt)}</td>
                <td class="cs5720DF67" style="width:106px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalDrAmt)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalCrAmt)}</td>
                <td class="cs5720DF67" colspan="6" style="width:106px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalEdrAmt)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.totalEcrAmt)}</td>
            </tr>`).join("")}
            `).join("")}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csC7C9BB91" colspan="6" style="width:363px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:359px;height:15px;">
                    <div style="width:359px;height:13px;overflow:hidden;display:table;">
                        <div style="vertical-align:middle;display:table-cell;">
                            <nobr>Нийт</nobr></div>
                    </div>
                </div>
                </td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalBDr)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalBCr)}</td>
                <td class="cs5720DF67" style="width:106px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalDr)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalCr)}</td>
                <td class="cs5720DF67" colspan="6" style="width:106px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalEDr)}</td>
                <td class="cs5720DF67" style="width:105px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(data?.totalEDr)}</td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:50px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="4" style="width:300px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч&nbsp;:&nbsp;__________________________</nobr></td>
                <td class="cs376BE254" colspan="6" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.accountant || ''}</nobr></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="4" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
                <td class="cs376BE254" colspan="6" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.director || ''}</nobr></td>
                <td></td>
            </tr>
        </table>
        </body>
        </html>`;

    // const printPdf = (pdfBlobUrl) => {
    //     const iframe = document.createElement("iframe");
    //     iframe.style.position = "fixed";
    //     iframe.style.right = "0";
    //     iframe.style.bottom = "0";
    //     iframe.style.width = "0";
    //     iframe.style.height = "0";
    //     iframe.style.border = "none";
    //     iframe.src = pdfBlobUrl;
    //     document.body.appendChild(iframe);
      
    //     iframe.onload = () => {
    //       setTimeout(() => {
    //         iframe.contentWindow.focus();
    //         iframe.contentWindow.print();
      
    //         // remove iframe after print
    //         setTimeout(() => {
    //           document.body.removeChild(iframe);
    //         }, 1000);
    //       }, 500);
    //     };
    //   };

      
    //   const handleExport = () => {
    //     const element = document.getElementById("to_pdf");
      
    //     const opt = {
    //       margin:       0.5,
    //       filename:     fileName ?? 'report.pdf',
    //       image:        { type: 'jpeg', quality: 0.98 },
    //       html2canvas:  { scale: 2 },
    //       jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    //     };
      
    //     html2pdf()
    //       .set(opt)
    //       .from(element)
    //       .outputPdf('blob')
    //       .then((blob) => {
    //         const blobUrl = URL.createObjectURL(blob);
    //         printPdf(blobUrl);
    //       });
    //   };
      
    const filterProps = {date, setDate, type, onSearch, loading, error, filename: 'balance', id: 'balance_to_pdf', land: true, html: balanceHtml};
    const emptyProps = { icon: 'MdReceipt'};

  return (
    <div>
        <Filter size={size} {...filterProps}/>
        {data?.data?.length ? <div className="fi_pdf_back" id='list_scroll'>
            <div className='list_pdf_back' id='balance_to_pdf'>
                {parse(balanceHtml)}
                {/* <JournalInquiry data={data} login_image={image}/> */}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>

  );
}