import React from "react";
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from '../general_journal/Filter';
import { Empty1 } from "../../../../../components/all";


function IncomeList  (props) {
  const { data, date, setDate, type, onSearch, loading, error, size,} = props;

  const datahtml = `
    <html>
    <head>
        <title>rpt_CashFlowStatement</title>
        <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
        <style type="text/css">
            .csA76FB66B {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
            .cs1F4AB7FC {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
            .csA8DCAC4A {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
            .cs2E727FF9 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
            .csEC04FD81 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
            .cs5134A6F9 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;}
            .csD802F637 {color:#4A55A2;background-color:#4A55A2;border-left-style: none;border-top:#696969 1px solid;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
            .cs11B876A5 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
            .cs68F9EDA4 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
            .cs384B06FE {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
            .csF7E0B727 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
            .cs50E86AE1 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
            .cs5170D47 {color:#5C6476;background-color:#5C6476;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Times New Roman'; font-size:13px; font-weight:normal; font-style:normal; }
            .csF37861E8 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
            .csC9A219C3 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
            .csF0CBC0F6 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
            .csAC6A4475 {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
        </style>
    </head>
    <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
    <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:768px;height:493px;position:relative;background-color:#FFFFFF;">
        <tr style="vertical-align:top;">
            <td style="width:0px;height:19px;"></td>
            <td style="width:9px;"></td>
            <td style="width:76px;"></td>
            <td style="width:28px;"></td>
            <td style="width:48px;"></td>
            <td style="width:3px;"></td>
            <td style="width:110px;"></td>
            <td style="width:226px;"></td>
            <td style="width:20px;"></td>
            <td style="width:34px;"></td>
            <td style="width:3px;"></td>
            <td style="width:29px;"></td>
            <td style="width:94px;"></td>
            <td style="width:38px;"></td>
        <tr style="vertical-align: top;">
            <td style="width: 0px; height: 19px;"></td>
            <td class="cs1324BC0C" colspan="3" rowspan="3" style="width:113px;height:38px;text-align:left;vertical-align:top;"><div style="overflow:hidden;width:113px;height:50px;">
                <div style="overflow:hidden;width:130px;height:45px;">
			<img 
			src="${data?.header?.merchanLogo}" 
			alt="logo" 
			style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;" 
			/>
		</div>
            </div>
            </td>
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
            <td style="width:0px;height:19px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="cs1F4AB7FC" colspan="3" style="width:157px;height:19px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>${data?.header?.cmpName}</nobr></td>
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
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:30px;"></td>
            <td class="csF0CBC0F6" colspan="13" style="width:744px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ОРЛОГЫН&nbsp;ДЭЛГЭРЭНГҮЙ&nbsp;ТАЙЛАН</nobr></td>
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
        <tr style="vertical-align:top;">
            <td style="width:0px;height:19px;"></td>
            <td class="csF7E0B727" colspan="6" style="width:270px;height:19px;line-height:14px;text-align:center;vertical-align:middle;"> <nobr>${data?.header?.cmpName}</nobr></td>
            <td></td>
            <td></td>
            <td class="cs50E86AE1" colspan="5" style="width:194px;height:19px;line-height:14px;text-align:right;vertical-align:middle;"> <nobr>${data?.header?.dateRange}</nobr></td>
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:1px;"></td>
            <td class="csD802F637" colspan="6" style="width:274px;height:0px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
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
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:19px;"></td>
            <td class="cs384B06FE" colspan="6" style="width:270px;height:19px;line-height:13px;text-align:center;vertical-align:top;"><nobr>(&nbsp;Аж&nbsp;ахуйн&nbsp;нэгжийн&nbsp;нэр&nbsp;)</nobr></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="csEC04FD81" colspan="3" style="width:157px;height:19px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>(төгрөгөөр)</nobr></td>
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
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:45px;"></td>
            <td class="cs11B876A5" colspan="2" style="width:81px;height:36px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Мөрийн</nobr><br/><nobr>дугаар</nobr></td>
            <td class="cs11B876A5" colspan="9" style="width:497px;height:36px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Үзүүлэлт</nobr></td>
            <td class="cs68F9EDA4" colspan="2" style="width:124px;height:36px;line-height:13px;text-align:center;vertical-align:middle;"> <nobr>${data?.header?.dateRange}</nobr></td>
            </td>
            </tr>
            ${data?.data?.map(item => `
            <tr style="vertical-align:top;">
                <td></td>
                <td class="csF37861E8" colspan="2" style="width:81px;height:20px;text-align:left;vertical-align:middle;">
                ${item.lineNumber ?? ''}
                </td>
                <td class="csF37861E8" colspan="9" style="width:497px;height:20px;text-align:left;vertical-align:middle;">
                ${item.propertyDescr ?? ''}
                </td>
            <td class="csC9A219C3" colspan="2" style="width:124px;height:20px;text-align:right;vertical-align:middle;">
            ${formatNumber2(item?.endBalance)}
                </td>
            </tr>
            `).join('')}
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:19px;"></td>
            <td class="cs2E727FF9" colspan="13" style="width:714px;height:19px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
        </tr>	
        <tr style="vertical-align:top;">
            <td style="width:0px;height:2px;"></td>
            <td></td>
            <td class="cs5170D47" colspan="12" style="width:709px;height:2px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:36px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
            <td style="width:0px;height:28px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="cs5134A6F9" colspan="3" style="width:337px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
            <td class="cs5134A6F9" colspan="5" style="width:178px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>${data?.header?.director}</nobr></td>
            <td></td>
        </tr>
        <tr style="vertical-align:top;">
            <td style="width:0px;height:10px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
            <td style="width:0px;height:28px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="cs5134A6F9" colspan="3" style="width:337px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Ерөнхий&nbsp;нягтлан&nbsp;бодогч:&nbsp;___________________________</nobr></td>
            <td class="cs5134A6F9" colspan="5" style="width:178px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>${data?.header?.accountant}</nobr></td>
            <td></td>
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
        </tr>
    </table>
    </body>
    </html>
  `
//   const handleExport = () => {
//     const element = document.getElementById("to_pdf");
//     const options = {
//       filename: "cashflow_report.pdf",
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(options).save();
//   };

  const filterProps = { date, setDate, type, onSearch, loading,error, size, html: datahtml, id: 'income_to_pdf' };

  const emptyProps = { icon: "MdReceipt", id: "fi_empBack" };

  return (
    <div>
        
      <Filter {...filterProps} />
      {data?.data?.length ? <div className="fi_pdf_back1" id='list_scroll' >
            <div className='list_pdf_back' id='income_to_pdf'>
                {parse(datahtml)}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}

export default IncomeList;