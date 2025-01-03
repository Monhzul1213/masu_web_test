import React from 'react';
import html2pdf from "html2pdf.js";
import parse from "react-html-parser";
import moment from 'moment';

import { DynamicMDIcon} from '../../../../../components/all';
import { formatNumber2 } from '../../../../../helpers';
import { login_image } from '../../../../../assets';

export function WorkList(props){
    const { data } = props;

    console.log(data, "workdata");

    const workHtml = `
        <html>
        <head>
            <title>rptWorkSheet</title>
            <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
            <style type="text/css">
                .csF9872371 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Microsoft Sans Serif'; font-size:11px; font-weight:normal; font-style:normal; }
                .csB8C3774E {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .cs8EE453EA {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
                .cs5F549EA6 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:9px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:23px;padding-bottom:4px;}
                .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:9px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .csC7C9BB91 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .csC905D4E {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:8px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs8A9395F {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:8px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
                .csACA7F89 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:8px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .cs4F769D32 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:8px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:9px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:9px;padding-bottom:4px;}
                .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:9px; font-weight:normal; font-style:normal; }
                .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
                .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
            </style>
        </head>
        <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
        <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:100%;height:506px;position:relative;">
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td style="width:113px;"></td>
                <td style="width:27px;"></td>
                <td style="width:50px;"></td>
                <td style="width:41px;"></td>
                <td style="width:73px;"></td>
                <td style="width:17px;"></td>
                <td style="width:91px;"></td>
                <td style="width:91px;"></td>
                <td style="width:90px;"></td>
                <td style="width:91px;"></td>
                <td style="width:91px;"></td>
                <td style="width:53px;"></td>
                <td style="width:27px;"></td>
                <td style="width:6px;"></td>
                <td style="width:5px;"></td>
                <td style="width:37px;"></td>
                <td style="width:13px;"></td>
                <td style="width:40px;"></td>
                <td style="width:91px;"></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:16px;"></td>
                <td class="csF9872371" rowspan="2" style="width:113px;height:38px;text-align:left;vertical-align:top;"><div style="overflow:hidden;width:113px;height:38px;">
                    <img alt="" src="logo.png" style="width:0px;height:0px;margin-top:19px;" /></div>
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
                <td></td>
                <td></td>
                <td class="cs6497CDF" colspan="6" style="width:192px;height:22px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
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
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td class="csA719B1F9" colspan="19" style="width:1043px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>АЖЛЫН&nbsp;ХҮСНЭГТ</nobr></td>
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
                <td class="cs8D49975B" colspan="4" style="width:63px;height:10px;line-height:14px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:59px;height:19px;">
                    <div style="width:59px;height:14px;overflow:hidden;display:table;">
                        <div style="vertical-align:middle;display:table-cell;">
                            <nobr>Огноо</nobr></div>
                    </div>
                </div>
                </td>
                <td class="cs26E6DE06" colspan="3" style="width:136px;height:11px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
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
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:38px;"></td>
                <td class="csB8C3774E" colspan="2" rowspan="2" style="width:135px;height:54px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Данс</nobr></td>
                <td class="cs8EE453EA" colspan="4" style="width:172px;height:29px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Шалгах&nbsp;баланс</nobr></td>
                <td class="cs8EE453EA" colspan="2" style="width:173px;height:29px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Гүйлгээ</nobr></td>
                <td class="cs8EE453EA" colspan="2" style="width:172px;height:29px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Хаалтын&nbsp;бичилтийн&nbsp;өмнөх</nobr><br/><nobr>шалгах&nbsp;баланс</nobr></td>
                <td class="cs8EE453EA" colspan="5" style="width:173px;height:29px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>ОЗНДанс</nobr></td>
                <td class="cs8EE453EA" colspan="4" style="width:172px;height:29px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Үлдэгдэл&nbsp;баланс</nobr></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:25px;"></td>
                <td class="cs8EE453EA" colspan="2" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" colspan="2" style="width:81px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" style="width:81px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" colspan="4" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="cs8EE453EA" colspan="3" style="width:81px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="cs8EE453EA" style="width:82px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csF7EB0CA5" colspan="19" style="width:1043px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs5F549EA6" colspan="19" style="width:1024px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csACA7F89" colspan="2" style="width:136px;height:10px;line-height:9px;text-align:left;vertical-align:middle;"><nobr>&nbsp;-</nobr></td>
                <td class="cs4F769D32" colspan="2" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" colspan="2" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" colspan="4" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" colspan="3" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs4F769D32" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td class="cs1E07F7AF" colspan="2" style="width:127px;height:9px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="cs8A9395F" colspan="2" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" colspan="2" style="width:82px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:82px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" colspan="4" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" colspan="3" style="width:82px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8A9395F" style="width:83px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csC7C9BB91" colspan="2" style="width:136px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="2" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="2" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="4" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="3" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csC7C9BB91" colspan="2" style="width:136px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:132px;height:10px;">
                    <div style="width:132px;height:13px;overflow:hidden;display:table;">
                        <div style="vertical-align:middle;display:table-cell;">
                            <nobr>Нийт</nobr></div>
                    </div>
                </div>
                </td>
                <td class="csC905D4E" colspan="2" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="2" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="4" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" colspan="3" style="width:82px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csC905D4E" style="width:83px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:28px;"></td>
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
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:66px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="9" style="width:557px;height:66px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч&nbsp;:&nbsp;		/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	/	</nobr><br/><br/><br/><nobr>Захирал&nbsp;:&nbsp;				/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	/		</nobr><br/><nobr>		</nobr></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:55px;"></td>
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
                <td></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs6497CDF" colspan="3" style="width:190px;height:19px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Хэвлэсэн:&nbsp;2024.12.03&nbsp;15:01:34</nobr></td>
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
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
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
    <div className="fi_pdf_back1" >
        <div className='j_header_back'>
            <button onClick={zoomIn}>+</button>
            <button onClick={zoomOut}>-</button>
            <DynamicMDIcon onClick={handleExport} name='MdOutlineFileDownload' className='download_icon'/>
        </div>   
        <div className='list_pdf_back' id='list_scroll' >
          <div id='order_bo_pdf' className="a4-layout" >
            {parse(workHtml)}
          </div>
        </div>
    </div>
  );
}