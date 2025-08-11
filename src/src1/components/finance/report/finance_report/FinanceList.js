
import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from '../general_journal/Filter';
import { Empty1 } from '../../../../../components/all';

export function FinanceList(props){
    const { data, date, setDate, type, onSearch, loading, error, size } = props;
    
	const financeListHtml = `
    <html><head>
	<title>rpt_BalanceStatement_Year</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<style type="text/css">
		.csA76FB66B {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; }
		.cs1F4AB7FC {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
		.cs1324BC0C {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; }
		.csE574A85B {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
		.csB1E2D3E6 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.cs2AA48A33 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csEC04FD81 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
		.cs5134A6F9 {color:#434956;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;}
		.cs59FFC025 {color:#4A55A2;background-color:#4A55A2;border-left-style: none;border-top:#696969 1px solid;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; }
		.cs11B876A5 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.cs68F9EDA4 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.cs159F12A7 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.cs384B06FE {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
		.csF7E0B727 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
		.cs50E86AE1 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-left:2px;padding-right:2px;}
		.csE7CE8FA9 {color:#5C6476;background-color:#5C6476;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; }
		.csF0CBC0F6 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
		.csAC6A4475 {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
	</style>
	</head>
	<body leftmargin="10" topmargin="10" rightmargin="10" bottommargin="10" style="background-color:#FFFFFF">
	<table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:766px;height:1578px;position:relative;background-color:#FFFFFF;">
	<tbody><tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td style="width:4px;"></td>
		<td style="width:81px;"></td>
		<td style="width:28px;"></td>
		<td style="width:48px;"></td>
		<td style="width:3px;"></td>
		<td style="width:110px;"></td>
		<td style="width:180px;"></td>
		<td style="width:46px;"></td>
		<td style="width:20px;"></td>
		<td style="width:34px;"></td>
		<td style="width:3px;"></td>
		<td style="width:29px;"></td>
		<td style="width:94px;"></td>
		<td style="width:38px;"></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="cs1324BC0C" colspan="3" rowspan="3" style="width:113px;height:38px;text-align:left;vertical-align:top;"><div style="overflow:hidden;width:113px;height:38px;">
			<div style="overflow:hidden;width:130px;height:40px;">
					<img 
					src="${data?.header?.merchanLogo}" 
					alt="logo" 
					style="max-width: 200px; max-height: 45px; display: block;" 
					/>
				</div>
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
		<td style="width:0px;height:19px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs1F4AB7FC" colspan="3" style="width:157px; height:40px; line-height:13px; text-align:right; vertical-align:top; padding-top:2px;"><nobr>${data?.header?.cmpName}</nobr></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:1px;"></td>
		<td></td>
		<td></td>
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
		<td class="csF0CBC0F6" colspan="14" style="width:714px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>САНХҮҮГИЙН&nbsp;БАЙДЛЫН&nbsp;ТАЙЛАН</nobr></td>
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
		<td style="width:0px;height:19px;"></td>
		<td class="csF7E0B727" colspan="6" style="width:270px;height:19px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>${data?.header?.cmpName}</nobr></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs50E86AE1" colspan="5" style="width:194px;height:19px;line-height:14px;text-align:right;vertical-align:middle;"><nobr>${data?.header?.dateRange}</nobr></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:1px;"></td>
		<td class="cs59FFC025" colspan="6" style="width:274px;height:0px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
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
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="cs384B06FE" colspan="6" style="width:270px;height:19px;line-height:13px;text-align:center;vertical-align:top;"><nobr>(&nbsp;Аж&nbsp;ахуйн&nbsp;нэгжийн&nbsp;нэр&nbsp;)</nobr></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="csEC04FD81" colspan="3" style="width:157px;height:19px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>(төгрөгөөр)</nobr></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:20px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
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
		<td class="cs11B876A5" colspan="2" style="width:81px;height:36px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Мөрийн</nobr><br><nobr>дугаар</nobr></td>
		<td class="cs11B876A5" colspan="5" style="width:365px;height:36px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Үзүүлэлт</nobr></td>
		<td class="cs68F9EDA4" colspan="5" style="width:124px;height:36px;line-height:13px;text-align:center;vertical-align:middle;">
		<nobr>${date?.[0]?.format('YYYY')} оны ${date?.[0]?.format('MM')} сарын ${date?.[0]?.format('DD')}</nobr>
		</td>
		<td class="cs68F9EDA4" colspan="5" style="width:124px;height:36px;line-height:13px;text-align:center;vertical-align:middle;">
		<nobr>${date?.[1]?.format('YYYY')} оны ${date?.[1]?.format('MM')} сарын ${date?.[1]?.format('DD')}</nobr>
		</td>
	</tr>
	<tr style="vertical-align:top;">
	${data?.newData?.map((row) => `
		<tr style="vertical-align:top;">
			<td style="width:0px;height:19px;"></td>
			<td class="${row.isBold ? 'cs159F12A7' : 'cs2AA48A33'}" colspan="2" style="width:81px;height:15px;line-height:13px;text-align:left;vertical-align:middle;">
				<div style="overflow:hidden;width:77px;height:15px;">
					<div style="width:77px;height:15px;overflow:hidden;display:table;">
						<div style="vertical-align:middle;display:table-cell;">
							<nobr>${row.lineColumn || ''}</nobr>
						</div>
					</div>
				</div>
			</td>
			<td class="${row.isBold ? 'cs159F12A7' : 'cs2AA48A33'}" colspan="5" style="
				width:365px;
				height:15px;
				line-height:13px;
				vertical-align:middle;
				">
				<div style="overflow:hidden;width:361px;height:15px;">
					<div style="width:361px;height:13px;overflow:hidden;display:table;">
						<div style="vertical-align:middle;display:table-cell;">
							<nobr>${row.propertyDescr || ''}</nobr>
						</div>
					</div>
				</div>
			</td>
			<td class="cs2AA48A33" colspan="5" style="
				width:124px;
				height:15px;
				text-align:right;
			">
				<nobr>${
					(row.propertyDescr && row.lineColumn !== "1" && row.lineColumn !== "1.1")
						? formatNumber2(row.beginBalance)
						: ''
				}</nobr>
			</td>
			<td class="cs2AA48A33" colspan="2" style="
				width:124px;
				height:15px;
				text-align:right;
			">
				<nobr>${
					(row.propertyDescr && row.lineColumn !== "1" && row.lineColumn !== "1.1")
						? formatNumber2(row.endBalance)
						: ''
				}</nobr>
			</td>
		</tr>
	`).join('')}

	
	<tr style="vertical-align:top;">
		<td style="width:0px;height:2px;"></td>
		<td></td>
		<td class="csE7CE8FA9" colspan="13" style="width:714px;height:2px;"><!--[if lte IE 7]><div class="csAC6A4475"></div><![endif]--></td>
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
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:28px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs5134A6F9" colspan="4" style="width:337px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
		<td class="cs5134A6F9" colspan="5" style="width:178px;height:28px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>${data?.header?.director || ''}</nobr></td>
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
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:29px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs5134A6F9" colspan="4" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Ерөнхий&nbsp;нягтлан&nbsp;бодогч:&nbsp;___________________________</nobr></td>
		<td class="cs5134A6F9" colspan="5" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>${data?.header?.accountant || ''}</nobr></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:70px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
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
	</html>`

  const filterProps = {date, setDate, type, onSearch, loading, error, filename: 'finance', id: 'finance_to_pdf', size};
  const emptyProps = { icon: 'MdReceipt', id: 'fi_empBack'};
  return (
    <div>
        <Filter {...filterProps}/>
        {data?.newData?.length ? <div className="fi_pdf_back" id='list_scroll'>
            <div className='list_pdf_back' id='finance_to_pdf'>
                {parse(financeListHtml)}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}