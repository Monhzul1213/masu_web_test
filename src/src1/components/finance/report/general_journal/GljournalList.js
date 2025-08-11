import React from 'react';
import parse from "react-html-parser";
import moment from 'moment';

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from './Filter';
import { Empty1 } from '../../../../../components/all';

export function GljournalList(props){
    const { data, date, setDate, type, onSearch, loading, error, size, image } = props;


    const journalListHtml = `
    <html>
    <head>
        <title>Rpt_GLJournalList</title>
        <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
        <style type="text/css">
        tr {
            page-break-inside: avoid;
            page-break-after: auto;
        }
        .page-break {
            page-break-before: always; 
          }
            .csA04C28A0 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size: 11px; font-weight:normal; font-style:normal; }
            .csB8C3774E {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
            .cs8EE453EA {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
            .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
            .csCCCC758 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
            .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:7px;}
            .csE172C9E1 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:7px;}
            .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
            .csB3335A17 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:7px;}
            .cs9C1F77F0 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:7px;}
            .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; }
            .csBF6B980E {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:7px;}
            .csA8E73E03 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:7px;}
            .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal;}
            .cs6497CDF1 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal;}
            .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
            .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size: 0px;line-height:0px;}
        </style>
    </head>
    <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
    <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:200mm;height:472px;position:relative;">
        <tr style="vertical-align:top;">
            <td style="width:0px;height:19px;"></td>
            <td style="width:100px;"></td>
            <td style="width:13px;"></td>
            <td style="width:38px;"></td>
            <td style="width:39px;"></td>
            <td style="width:52px;"></td>
            <td style="width:34px;"></td>
            <td style="width:63px;"></td>
            <td style="width:152px;"></td>
            <td style="width:8px;"></td>
            <td style="width:27px;"></td>
            <td style="width:48px;"></td>
            <td style="width:13px;"></td>
            <td style="width:18px;"></td>
            <td style="width:52px;"></td>
            <td style="width:61px;"></td>
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:16px;"></td>
            <td class="csA04C28A0" colspan="5" rowspan="3" style="width:350px;height:50px;text-align:left;vertical-align:top;">
                <div style="overflow:hidden;width:130px;height:45px;">
                    <img alt="" src=${`data:image/png;base64,${image?.fileData}`} style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" />
                </div>
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
            <td class="cs6497CDF1" colspan="5" style="width:192px;height:22px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${data?.header?.merchantName}</td>
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
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:30px;"></td>
            <td class="csA719B1F9" colspan="15" style="width:714px;height:35px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ЕРӨНХИЙ&nbsp;ЖУРНАЛ</nobr></td>
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
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:25px;"></td>
            <td class="csB8C3774E" colspan="3" rowspan="2" style="width:146px;height:41px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Данс</nobr></td>
            <td class="csB8C3774E" colspan="2" rowspan="2" style="width:86px;height:41px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Харилцагч</nobr></td>
            <td class="csB8C3774E" colspan="3" rowspan="2" style="width:244px;height:41px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Гүйлгээний&nbsp;утга</nobr></td>
            <td class="csCCCC758" colspan="7" style="width:219px;height:16px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Дүн</nobr></td>
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:25px;"></td>
            <td class="cs8EE453EA" colspan="5" style="width:105px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
            <td class="csCCCC758" colspan="2" style="width:105px;height:16px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
        </tr>
        ${data?.newData?.map((el, index) => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td class="csF7EB0CA5" colspan="3" style="width:147px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Баримтын&nbsp;№&nbsp;:</nobr>${el?.journalID}</td>
                <td class="csF7EB0CA5" colspan="3" style="width:121px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Огноо&nbsp;:</nobr>${moment(el?.txnDate).format('YYYY.MM.DD')}</td>
                <td class="csE172C9E1" style="width:55px;height:10px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дүн&nbsp;:</nobr>${formatNumber2(el?.totalAmt)}</td>
                <td class="csF7EB0CA5" colspan="8" style="width:375px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            ${el?.dtl?.map((li) => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csBF6B980E" colspan="3" style="width:147px;height:10px;">${li?.acct}</td>
                <td class="csBF6B980E" colspan="2" style="width:87px;height:10px;">${li?.custName}</td>
                <td class="csBF6B980E" colspan="3" style="width:245px;height:10px;">${li?.itemDescr}</td>
                <td class="csA8E73E03" colspan="5" style="width:106px;height:10px;text-align:right;">${formatNumber2(li?.drAmt)}</td>
                <td class="csA8E73E03" colspan="2" style="width:105px;height:10px;text-align:right;">${formatNumber2(li?.crAmt)}</td>
            </tr>`).join("")}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csB3335A17" colspan="8" style="width:487px;height:10px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Нийт</nobr></td>
                <td class="cs9C1F77F0" colspan="5" style="width:106px;height:10px;text-align:right;vertical-align:middle;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(el?.totalDr)}</td>
                <td class="cs9C1F77F0" colspan="2" style="width:105px;height:10px;text-align:right;vertical-align:middle;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(el?.totalCr)}</td>
            </tr>
            ` + (index % 5 === 4 ? `<tr class="page-break"></tr>` : "")
        ).join("")}
        <tr style="vertical-align:top;">
            <td style="width:0px;height:47px;"></td>
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
        <tr style="vertical-align:top;">
            <td style="width:0px;height:53px;"></td>
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
    </table>
    </body>
    </html>
  `

  const filterProps = {date, setDate, type, onSearch, loading, error, size, id: 'gljournal_to_pdf', html: journalListHtml};
  const emptyProps = { icon: 'MdReceipt', id: 'fi_empBack'};

  return (
    <div>
        <Filter {...filterProps}/>
        {data?.newData?.length ? <div className="fi_pdf_back1" id='list_scroll'>
            <div className='list_pdf_back' id='gljournal_to_pdf'>
                {parse(journalListHtml)}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}