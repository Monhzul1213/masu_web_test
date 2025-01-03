import React from 'react';
import html2pdf from "html2pdf.js";
import parse from "react-html-parser";
// import moment from 'moment';

import { DynamicMDIcon, Empty, Empty1 } from '../../../../../components/all';
import { formatNumber2 } from '../../../../../helpers';
import { login_image } from '../../../../../assets';

export function BalanceList(props){
    const { data } = props;

    // console.log(data, 'baldata');
    const balanceHtml = `
        <html>
        <head>
            <title>JournalInquiry</title>
            <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
            <style type="text/css">
                .csF9872371 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Microsoft Sans Serif'; font-size:11px; font-weight:normal; font-style:normal; }
                .csB8C3774E {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs8EE453EA {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:6px;padding-bottom:4px;}
                .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
                .csCCCC758 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .cs5F549EA6 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:10px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:23px;padding-bottom:6px;}
                .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:10px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .csC7C9BB91 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .cs5720DF67 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .csB43E06EC {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-right:4px;padding-bottom:6px;}
                .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
                .cs3F179B19 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-bottom:6px;}
                .csDC191A99 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:6px;padding-right:4px;padding-bottom:4px;}
                .cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:10px; font-weight:normal; font-style:normal; padding-top:6px;padding-left:4px;padding-right:9px;padding-bottom:6px;}
                .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
                .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
                .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
            </style>
        </head>
        <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
        <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:100%;height:422px;position:relative;">
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
                <td class="csF9872371" colspan="5" rowspan="3" style="width:350px;height:50px;text-align:left;vertical-align:top;"><div style="overflow:hidden;width:130px;height:40px;">
                    <img alt="" src=${login_image} style="width:100%;height:100%;margin-top:0px;" /></div>
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
                <td class="cs6497CDF" colspan="5" style="width:192px;height:22px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${data?.header?.cmpName}</td>
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
                <td class="cs8D49975B" colspan="2" style="width:63px;height:10px;line-height:14px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:59px;height:19px;">
                    <div style="width:59px;height:10px;overflow:hidden;display:table;">
                        <div style="vertical-align:middle;display:table-cell;">
                            <nobr>Огноо</nobr></div>
                    </div>
                </div>
                </td>
                <td class="cs26E6DE06" colspan="5" style="width:136px;height:11px;text-align:right"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${data?.header?.dateRange}</td>
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
                <td style="width:0px;height:15px;"></td>
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
                <td style="width:0px;height:54px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="9" style="width:557px;height:54px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч&nbsp;:&nbsp;		/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	/	</nobr><br/><br/><nobr>Захирал&nbsp;:&nbsp;				/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	/		</nobr><br/><nobr>		</nobr></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:9px;"></td>
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
                <td style="width:0px;height:19px;"></td>
                <td class="cs6497CDF" colspan="3" style="width:190px;height:19px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Хэвлэсэн:&nbsp;2024.12.03&nbsp;14:50:31</nobr></td>
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
                <td class="cs6497CDF" colspan="2" style="width:131px;height:19px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>1/1</nobr></td>
            </tr>
        </table>
        </body>
        </html>`;

    const handleExport = () => {
        const element = document.getElementById("order_bo_pdf");
        const options = {
            // margin: [0.1, 0],
            filename: "report.pdf",
            html2canvas: { scale: 2},//scrollY: 0
            jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        };

        html2pdf().from(element).set(options).save();
    };

    const iframe = document.getElementById('order_bo_pdf');

    function zoomIn() {
      let scale = parseFloat(iframe.style.transform.replace("scale(", "").replace(")", "")) || 1;
      iframe.style.transform = `scale(${scale + 0.1})`; // Томруулах
    }

    function zoomOut() {
      let scale = parseFloat(iframe.style.transform.replace("scale(", "").replace(")", "")) || 1;
      iframe.style.transform = `scale(${scale - 0.1})`; // Багасгах
      iframe.style.transformOrigin = "top";
    }

  return (
    <div className="fi_pdf_back" >
        <div className='j_header_back'>
            <button onClick={zoomIn}>+</button>
            <button onClick={zoomOut}>-</button>
            <DynamicMDIcon onClick={handleExport} name='MdOutlineFileDownload' className='download_icon'/>
        </div>   
        <div className='list_pdf_back' id='list_scroll' >
          <div id='order_bo_pdf' className="a4-layout" >
            {parse(balanceHtml)}
          </div>
        </div>
    </div>
  );
}