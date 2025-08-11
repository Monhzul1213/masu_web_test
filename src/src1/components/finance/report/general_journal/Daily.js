
import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from './Filter';
import { Empty1 } from '../../../../../components/all';

export function Daily(props){
    const { data, date, setDate, type, onSearch, loading, error, size } = props;

    const dailyListHtml = `
<html>
<head>
	<title>rptInReceipt</title>
	<meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
	<style type="text/css">
		.csF9872371 {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Microsoft Sans Serif'; font-size:11px; font-weight:normal; font-style:normal; }
		.csFAB57E46 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.csF98E57E6 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csCF3CA171 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
		.cs2D94961D {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#F5F5F5 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
		.cs9ED2C089 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#F5F5F5 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csEA0F055D {color:#5C6476;background-color:#5C6476;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:'Microsoft Sans Serif'; font-size:10px; font-weight:bold; font-style:normal; }
		.csEB63933C {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
		.cs5720DF67 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csB43E06EC {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csC2BCAF53 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.cs3F179B19 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.csDC191A99 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size:9px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:9px;padding-bottom:4px;}
		.csCBB8C53B {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
		.cs6B37C78C {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.cs41CC1A2 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:11px; font-weight:normal; font-style:normal; padding-left:2px;}
		.csF89A2D88 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:16px; font-weight:normal; font-style:normal; }
		.cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:9px; font-weight:normal; font-style:normal; }
		.csCB26F6BC {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size:12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
		.csF7D3565D {height:0px;width:0px;overflow:hidden;font-size:0px;line-height:0px;}
	</style>
</head>
<body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
<table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:719px;height:553px;position:relative;">
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td style="width:29px;"></td>
		<td style="width:84px;"></td>
		<td style="width:39px;"></td>
		<td style="width:38px;"></td>
		<td style="width:136px;"></td>
		<td style="width:2px;"></td>
		<td style="width:42px;"></td>
		<td style="width:100px;"></td>
		<td style="width:29px;"></td>
		<td style="width:27px;"></td>
		<td style="width:14px;"></td>
		<td style="width:20px;"></td>
		<td style="width:14px;"></td>
		<td style="width:13px;"></td>
		<td style="width:9px;"></td>
		<td style="width:47px;"></td>
		<td style="width:75px;"></td>
		<td style="width:1px;"></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:16px;"></td>
		<td class="csF9872371" colspan="2" rowspan="2" style="width:113px;height:38px;text-align:left;vertical-align:top;"><div style="overflow:hidden;width:113px;height:38px;">
			<img alt="" src="Logo.png" style="width:0px;height:0px;margin-top:19px;" /></div>
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
		<td class="cs6497CDF" colspan="7" style="width:192px;height:22px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
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
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:30px;"></td>
		<td class="csCB26F6BC" colspan="18" style="width:711px;height:22px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ХАРИЛЦАХЫН&nbsp;ӨДРИЙН&nbsp;НЭГТГЭЛ</nobr></td>
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
		<td class="csCF3CA171" colspan="4" style="width:64px;height:10px;line-height:14px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:60px;height:10px;">
			<div style="width:60px;height:14px;overflow:hidden;display:table;">
				<div style="vertical-align:middle;display:table-cell;">
					<nobr>Огноо</nobr></div>
			</div>
		</div>
		</td>
		<td class="cs26E6DE06" colspan="4" style="width:136px;height:11px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
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
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:30px;"></td>
		<td class="csF98E57E6" style="width:21px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>№</nobr></td>
		<td class="csFAB57E46" colspan="3" style="width:157px;height:21px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Огноо</nobr></td>
		<td class="csF98E57E6" colspan="3" style="width:172px;height:21px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Орлого</nobr></td>
		<td class="csF98E57E6" colspan="4" style="width:162px;height:21px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Зарлага</nobr></td>
		<td class="csF98E57E6" colspan="7" style="width:171px;height:21px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Үлдэгдэл</nobr></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="cs2D94961D" colspan="8" style="width:459px;height:10px;line-height:13px;text-align:left;vertical-align:middle;"><div style="overflow:hidden;width:454px;height:10px;">
			<div style="width:454px;height:13px;overflow:hidden;display:table;">
				<div style="vertical-align:middle;display:table-cell;">
					<nobr>&nbsp;-</nobr></div>
			</div>
		</div>
		</td>
		<td class="cs9ED2C089" colspan="7" style="width:118px;height:10px;line-height:13px;text-align:right;vertical-align:middle;"><div style="overflow:hidden;width:119px;height:10px;">
			<div style="width:119px;height:13px;overflow:hidden;display:table;">
				<div style="vertical-align:middle;display:table-cell;">
					<nobr>Эхний&nbsp;үлдэгдэл&nbsp;:</nobr></div>
			</div>
		</div>
		</td>
		<td class="cs5720DF67" colspan="3" style="width:115px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:21px;"></td>
		<td class="cs1E07F7AF" colspan="12" style="width:547px;height:12px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
		<td class="csEB63933C" colspan="6" style="width:155px;height:20px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="csDC191A99" style="width:21px;height:10px;line-height:13px;text-align:right;vertical-align:middle;"><div style="overflow:hidden;width:21px;height:10px;">
			<div style="width:21px;height:13px;overflow:hidden;display:table;">
				<div style="vertical-align:middle;display:table-cell;">
					<nobr>0</nobr></div>
			</div>
		</div>
		</td>
		<td class="cs3F179B19" colspan="3" style="width:157px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="csDC191A99" colspan="3" style="width:172px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="csDC191A99" colspan="4" style="width:162px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="csDC191A99" colspan="6" style="width:170px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="csF89A2D88" colspan="11" style="width:540px;height:19px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="csB43E06EC" colspan="6" style="width:170px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="cs5720DF67" colspan="4" style="width:182px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="3" style="width:172px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="4" style="width:162px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="6" style="width:170px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:19px;"></td>
		<td class="csC2BCAF53" colspan="4" style="width:186px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="3" style="width:172px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="4" style="width:162px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs5720DF67" colspan="6" style="width:170px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:2px;"></td>
		<td class="csEA0F055D" colspan="17" style="width:718px;height:2px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:22px;"></td>
		<td class="csCBB8C53B" colspan="4" style="width:186px;height:14px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Нийт</nobr></td>
		<td class="cs6B37C78C" colspan="3" style="width:172px;height:14px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs6B37C78C" colspan="4" style="width:162px;height:14px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td class="cs6B37C78C" colspan="6" style="width:170px;height:14px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:74px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
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
		<td style="width:0px;height:15px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs41CC1A2" colspan="2" style="width:172px;height:15px;line-height:13px;text-align:left;vertical-align:top;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч:</nobr></td>
		<td></td>
		<td class="cs41CC1A2" colspan="10" style="width:313px;height:15px;line-height:13px;text-align:left;vertical-align:top;"><nobr>..........................................&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/</nobr></td>
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
		<td></td>
		<td></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:14px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs41CC1A2" colspan="2" style="width:172px;height:14px;line-height:13px;text-align:left;vertical-align:top;"><nobr>Дарга&nbsp;/Захирал/:</nobr></td>
		<td></td>
		<td class="cs41CC1A2" colspan="10" style="width:313px;height:14px;line-height:13px;text-align:left;vertical-align:top;"><nobr>..........................................&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/</nobr></td>
		<td></td>
		<td></td>
	</tr>
	<tr style="vertical-align:top;">
		<td style="width:0px;height:80px;"></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
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
		<td class="cs6497CDF" colspan="4" style="width:190px;height:19px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Хэвлэсэн:&nbsp;2025.06.24&nbsp;14:10:19</nobr></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td></td>
		<td class="cs6497CDF" colspan="3" style="width:131px;height:19px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>1/1</nobr></td>
		<td></td>
	</tr>
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
                {parse(dailyListHtml)}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}