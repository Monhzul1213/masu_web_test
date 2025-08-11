import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from './Filter';
import { Empty1 } from '../../../../../components/all';

export function JournalList(props){
    const { data, date, setDate, type, onSearch, loading, error, size, image } = props;

    const journalHtml = `
        <html>
        <head>
            <title>Rpt_GLJournal</title>
            <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
            <style type="text/css">
                .csA04C28A0 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size: 11px; font-weight:normal; font-style:normal; }
                .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
                .csFAB57E46 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .csF98E57E6 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11.5px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .csE172C9E1 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs9C1F77F0 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 9px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .cs8C3D8EB8 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 9px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;}
                .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; }
                .csBF6B980E {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .cs7DA5FA99 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;}
                .cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 9px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:9px;padding-bottom:4px;}
                .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; }
                .cs43B22FDD {color:#F5F5F5;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
                .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size: 0px;line-height:0px;}
            </style>
        </head>
        <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
        <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:100%;height:456px;position:relative;">
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td style="width:68px;"></td>
                <td style="width:32px;"></td>
                <td style="width:13px;"></td>
                <td style="width:77px;"></td>
                <td style="width:75px;"></td>
                <td style="width:113px;"></td>
                <td style="width:113px;"></td>
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
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td class="csA719B1F9" colspan="14" style="width:714px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ЕРӨНХИЙ&nbsp;ДЭВТЭР</nobr></td>
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
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:31px;"></td>
                <td class="csFAB57E46" style="width:64px;height:22px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Огноо</nobr></td>
                <td class="csFAB57E46" colspan="4" style="width:193px;height:22px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Гүйлгээний&nbsp;утга</nobr></td>
                <td class="csF98E57E6" style="width:105px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Харьцсан&nbsp;данс</nobr></td>
                <td class="csF98E57E6" style="width:105px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Дебит</nobr></td>
                <td class="csF98E57E6" colspan="5" style="width:106px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Кредит</nobr></td>
                <td class="csF98E57E6" colspan="2" style="width:105px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Үлдэгдэл</nobr></td>
            </tr>
            ${data?.data?.map(item => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csF7EB0CA5" colspan="7" style="width:487px;height:10px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Данс:</nobr>${item?.acctID}</td>
                <td class="csE172C9E1" colspan="5" style="width:105px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>Эхний&nbsp;үлдэгдэл:</nobr></td>
                <td class="csE172C9E1" colspan="2" style="width:105px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.baseUldegdel)}</td>
            </tr>
            ${item?.itemData?.map(list => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td class="csBF6B980E" style="width:64px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.txnDate}</td>
                <td class="csBF6B980E" colspan="4" style="width:193px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.txnDate}</td>
                <td class="cs7DA5FA99" style="width:105px;height:13px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.compAcct)}</td>
                <td class="cs7DA5FA99" style="width:105px;height:13px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.drAmt)}</td>
                <td class="cs7DA5FA99" colspan="5" style="width:106px;height:13px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.crAmt)}</td>
                <td class="cs7DA5FA99" colspan="2" style="width:105px;height:13px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.endBalance)}</td>
            </tr>`
            ).join("")}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:22px;"></td>
                <td class="cs1E07F7AF" colspan="6" style="width:365px;height:13px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="cs8C3D8EB8" style="width:105px;height:17px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8C3D8EB8" colspan="5" style="width:106px;height:17px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs8C3D8EB8" colspan="2" style="width:105px;height:17px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            `
            ).join("")}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs43B22FDD" colspan="6" style="width:374px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:370px;height:10px;">
                    <div style="width:370px;height:13px;overflow:hidden;display:table;">
                        <div style="vertical-align:middle;display:table-cell;">
                            <nobr>Бүлгийн&nbsp;дүн</nobr></div>
                    </div>
                </div>
                </td>
                <td class="cs9C1F77F0" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs9C1F77F0" colspan="5" style="width:106px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs9C1F77F0" colspan="2" style="width:105px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
                <td colspan="3"></td>
                <td></td>
                <td class="cs376BE254" colspan="3" style="width:300px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч&nbsp;:&nbsp;__________________________</nobr></td>
                <td class="cs376BE254" colspan="4" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.accountant || ''}</nobr></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td colspan="3"></td>
                <td></td>
                <td class="cs376BE254" colspan="3" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
                <td class="cs376BE254" colspan="4" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.director || ''}</nobr></td>
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
            </tr>
        </table>
        </body>
        </html>`;

    // const handleExport = () => {
    //     const element = document.getElementById("to_pdf");
    //     const options = {
    //         // margin: [0.1, 0],
    //         filename: "report.pdf",
    //         html2canvas: { scale: 2},//scrollY: 0
    //         jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    //     };

    //     html2pdf().from(element).set(options).save();
    // };

    const filterProps = {date, setDate, type, onSearch, loading, error, size, id:'journal_to_pdf', html: journalHtml};
    const emptyProps = { icon: 'MdReceipt', id: 'fi_empBack'};

    return (
        <div>
            <Filter {...filterProps}/>
            {data?.data?.length ? <div className="fi_pdf_back1" id='list_scroll'>
                <div className='list_pdf_back' id='journal_to_pdf'>
                    {parse(journalHtml)}
                </div>
            </div> : <Empty1 {...emptyProps}/>}
        </div>
    );
}