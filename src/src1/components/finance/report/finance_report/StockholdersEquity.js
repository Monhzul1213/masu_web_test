import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from '../general_journal/Filter';
import { Empty1 } from '../../../../../components/all';

export function StockholdersEquity(props){
    const { data, date, setDate, type, onSearch, loading, error, size } = props;

    const stockListHtml = `
    <html>
    <head>
    <title>rpt_EquityChanges</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style type="text/css">
        .csA76FB66B {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
        .cs1F4AB7FC {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
        .csA8DCAC4A {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
        .csB1E2D3E6 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
        .cs2AA48A33 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
        .csEC04FD81 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
        .cs5134A6F9 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;}
        .csD802F637 {color:#4A55A2;background-color:#4A55A2;border-left-style: none;border-top:#696969 1px solid;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
        .cs11B876A5 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
        .cs68F9EDA4 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
        .cs384B06FE {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
        .csF7E0B727 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
        .cs50E86AE1 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
        .cs5170D47 {color:#5C6476;background-color:#5C6476;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
        .csF0CBC0F6 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
        .csAC6A4475 {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
    </style>
</head>
<body leftmargin="10" topmargin="10" rightmargin="10" bottommargin="10" style="background-color:#FFFFFF">
<table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:1047px;height:599px;position:relative;background-color:#FFFFFF;">
    <tbody><tr style="vertical-align:top;">
        <td style="width:0px;height:19px;"></td>
        <td style="width:61px;"></td>
        <td style="width:52px;"></td>
        <td style="width:51px;"></td>
        <td style="width:110px;"></td>
        <td style="width:10px;"></td>
        <td style="width:61px;"></td>
        <td style="width:90px;"></td>
        <td style="width:75px;"></td>
        <td style="width:76px;"></td>
        <td style="width:37px;"></td>
        <td style="width:57px;"></td>
        <td style="width:104px;"></td>
        <td style="width:19px;"></td>
        <td style="width:46px;"></td>
        <td style="width:11px;"></td>
        <td style="width:23px;"></td>
        <td style="width:3px;"></td>
        <td style="width:78px;"></td>
        <td style="width:83px;"></td>
    </tr>
    <tr style="vertical-align:top;">
        <td style="width:0px;height:16px;"></td>
        <td colspan="2" rowspan="2" style="width:350px;height:50px;text-align:left;vertical-align:top;">
        <div style="overflow:hidden;width:130px;height:45px;">
            <img
            src="${data?.header?.merchanLogo}"
            alt="logo"
            style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;"
            />
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
        <td></td>
        <td></td>
        <td></td>
        <td class="cs1F4AB7FC" colspan="2" style="width:157px;height:19px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>${data?.header?.cmpName}</nobr></td>
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
        <td class="csF0CBC0F6" colspan="19" style="width:1043px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ӨМЧИЙН&nbsp;ӨӨРЧЛӨЛТИЙН&nbsp;ТАЙЛАН</nobr></td>
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
        <td class="csF7E0B727" colspan="4" style="width:270px;height:19px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>${data?.header?.cmpName}</nobr></td>
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
        <td class="cs50E86AE1" colspan="5" style="width:194px;height:19px;line-height:14px;text-align:right;vertical-align:middle;"><nobr>${data?.header?.dateRange}</nobr></td>
    </tr>
    <tr style="vertical-align:top;">
        <td style="width:0px;height:1px;"></td>
        <td class="csD802F637" colspan="4" style="width:274px;height:0px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
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
        <td style="width:0px;height:6px;"></td>
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
        <td class="cs384B06FE" colspan="4" style="width:270px;height:19px;line-height:13px;text-align:center;vertical-align:top;"><nobr>(&nbsp;Аж&nbsp;ахуйн&nbsp;нэгжийн&nbsp;нэр&nbsp;)</nobr></td>
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
        <td class="csEC04FD81" colspan="2" style="width:157px;height:19px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>(төгрөгөөр)</nobr></td>
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
        <td style="width:0px;height:53px;"></td>
        <td class="cs11B876A5" style="width:57px;height:44px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Мөрийн</nobr><br><nobr>дугаар</nobr></td>
        <td class="cs11B876A5" colspan="5" style="width:280px;height:44px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Үзүүлэлт</nobr></td>
        <td class="cs68F9EDA4" style="width:82px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Өмч</nobr></td>
        <td class="cs68F9EDA4" style="width:67px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Халаасны</nobr><br><nobr>хувьцаа</nobr></td>
        <td class="cs68F9EDA4" style="width:68px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Нэмж</nobr><br><nobr>төлөгдсөн</nobr><br><nobr>капитал</nobr></td>
        <td class="cs68F9EDA4" colspan="2" style="width:86px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Хөрөнгийн</nobr><br><nobr>дахин</nobr><br><nobr>үнэлгээний&nbsp;дүн</nobr></td>
        <td class="cs68F9EDA4" style="width:96px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Гадаад&nbsp;валютын</nobr><br><nobr>хөрвүүлэлтийн</nobr><br><nobr>нөөц</nobr></td>
        <td class="cs68F9EDA4" colspan="3" style="width:68px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Эздийн</nobr><br><nobr>өмчийн</nobr><br><nobr>бусад&nbsp;хэсэг</nobr></td>
        <td class="cs68F9EDA4" colspan="3" style="width:96px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Хуримтлагдсан</nobr><br><nobr>ашиг</nobr></td>
        <td class="cs68F9EDA4" style="width:75px;height:44px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Нийт&nbsp;дүн</nobr></td>
    </tr>
    ${data?.newData?.map((row, index) => `
    <tr style="vertical-align:top;">
        <td style="width:0px;height:19px;"></td>
        <td class="csB1E2D3E6" style="width:57px;height:15px;line-height:13px;text-align:left;vertical-align:middle;">
        <div style="overflow:hidden;width:53px;height:15px;">
            <div style="width:53px;height:13px;overflow:hidden;display:table;">
            <div style="vertical-align:middle;display:table-cell;">
                <nobr>${row.lineNumber || ''}</nobr>
            </div>
            </div>
        </div>
        </td>
        <td class="csB1E2D3E6" colspan="5" style="width:280px;height:15px;line-height:13px;text-align:left;vertical-align:middle;">
        <div style="width:276px;">
        <div style="display:table;">
            <div style="vertical-align:middle; display:table-cell; white-space:normal;">
            ${row.propertyDescr || ''}
            </div>
        </div>
        </div>
 
        </td>
 
        <td class="cs2AA48A33" style="width:82px;height:15px;text-align:left;vertical-align:top;">${formatNumber2(row.amount1)}</td>
        <td class="cs2AA48A33" style="width:67px;height:15px;"></td>
        <td class="cs2AA48A33" style="width:68px;height:15px;">${formatNumber2(row.amount2 )}</td>
        <td class="cs2AA48A33" colspan="2" style="width:86px;height:15px;">${formatNumber2(row.amount3 )}</td>
        <td class="cs2AA48A33" style="width:96px;height:15px;">${formatNumber2(row.amount4 ?? 0)}</td>
        <td class="cs2AA48A33" colspan="3" style="width:68px;height:15px;"></td>
        <td class="cs2AA48A33" colspan="3" style="width:96px;height:15px;text-align:left;vertical-align:top;">${formatNumber2(row.amount5)}</td>
        <td class="cs2AA48A33" style="width:75px;height:15px;line-height:13px;text-align:right;vertical-align:middle;">
        <div style="overflow:hidden;width:76px;height:15px;">
            <div style="width:76px;height:13px;overflow:hidden;display:table;">
            <div style="vertical-align:middle;display:table-cell;">
                <nobr>${formatNumber2(row.amount6)}</nobr>
            </div>
            </div>
        </div>
        </td>
    </tr>
    `).join('')}
 
   
    <tr style="vertical-align:top;">
        <td style="width:0px;height:2px;"></td>
        <td class="cs5170D47" colspan="19" style="width:1047px;height:2px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
    </tr>
    <tr style="vertical-align:top;">
        <td style="width:0px;height:7px;"></td>
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
        <td style="width:0px;height:50px;"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="cs5134A6F9" colspan="5" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
        <td class="cs5134A6F9" colspan="3" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.director || ''}</nobr></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr style="vertical-align:top;">
        <td style="width:0px;height:2px;"></td>
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
        <td style="width:0px;height:29px;"></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="cs5134A6F9" colspan="5" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Ерөнхий&nbsp;нягтлан&nbsp;бодогч:&nbsp;___________________________</nobr></td>
        <td class="cs5134A6F9" colspan="3" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>${data?.header?.accountant || ''}</nobr></td>
       
    </tr>
    <tr style="vertical-align:top;">
        <td style="width:0px;height:100px;"></td>
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
   
</tbody>
</table>

</body>
</html>
  `

//   const handleExport = () => {
//     const element = document.getElementById("to_pdf");
//     const options = {
//         // margin: [0.1, 0],
//         filename: "report.pdf",
//         html2canvas: { scale: 2},//scrollY: 0
//         jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
//     };
//     html2pdf().from(element).set(options).save();
//     };

  const filterProps = {date, setDate, type, onSearch, loading, error, filename: 'equity', id: 'equity_to_pdf', size, land: true};
  const emptyProps = { icon: 'MdReceipt', id: 'fi_empBack'};

  return (
    <div>
        <Filter {...filterProps}/>
        {data?.newData?.length ? <div className="fi_pdf_back" id='list_scroll'>
            <div className='list_pdf_back' id='equity_to_pdf'>
                {parse(stockListHtml)}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}