import React from 'react';
import parse from "react-html-parser";

import { formatNumber2 } from '../../../../../helpers';
import { Filter } from './Filter';
import { Empty1 } from '../../../../../components/all';

export default function AccountStatement({ image, data }) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '10px' }}>
      <table
        cellPadding="0"
        cellSpacing="0"
        border="0"
        style={{ borderCollapse: "collapse", width: "100%", fontFamily: "Tahoma", fontSize: 12 }}
      >
        <thead>
          <tr>
            <td colSpan={6}>
              <div style={{ overflow: "hidden", width: 130, height: 40 }}>
                <img
                  alt="logo"
                  src={`data:image/png;base64,${image?.fileData}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            </td>
            <td colSpan={9} style={{ textAlign: 'right' }}>{data?.header?.merchantName}</td>
          </tr>
          <tr>
            <td colSpan={15} style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#4A55A2', color: '#fff', padding: '5px' }}>
              ДАНСНЫ ХУУЛГА
            </td>
          </tr>
          <tr  style={{
            backgroundColor: '#EFF1F5',
            fontWeight: 'bold',
            fontSize: 12,
            color: '#4A55A2',
            borderBottom: '1px solid var(--root-color)'}}>
            <td>№</td>
            <td colSpan={2}>Огноо</td>
            <td colSpan={2}>Гүйлгээний утга</td>
            <td>Харилцагч</td>
            <td colSpan={2} style={{ textAlign: 'right' }}>Орлого</td>
            <td colSpan={4} style={{ textAlign: 'right' }}>Зарлага</td>
            <td colSpan={2} style={{ textAlign: 'right' }}>Үлдэгдэл</td>
          </tr>
        </thead>

        <tbody>
          {data?.newData?.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td colSpan={8}>{item?.acct}</td>
                <td colSpan={4}>Эхний үлдэгдэл :</td>
                <td colSpan={2} style={{ textAlign: 'right' }}>{formatNumber2(item?.baseUldegdel)}</td>
              </tr>

              {item?.itemData?.map((list, idx) => (
                <tr key={idx}>
                  <td>{list?.no}</td>
                  <td colSpan={2}>{list?.txnDate}</td>
                  <td colSpan={2}>{list?.txnDescr}</td>
                  <td>{list?.custName}</td>
                  <td colSpan={2} style={{ textAlign: 'right' }}>{formatNumber2(list?.orlogo)}</td>
                  <td colSpan={4} style={{ textAlign: 'right' }}>{formatNumber2(list?.zarlaga)}</td>
                  <td colSpan={2} style={{ textAlign: 'right' }}>{formatNumber2(list?.uldegdel)}</td>
                </tr>
              ))}

              <tr>
                <td colSpan={6}></td>
                <td colSpan={2} style={{ textAlign: 'right' }}>{formatNumber2(item?.totalOrlogo)}</td>
                <td colSpan={4} style={{ textAlign: 'right' }}>{formatNumber2(item?.totalZarlaga)}</td>
                <td colSpan={2} style={{ textAlign: 'right' }}>{formatNumber2(item?.totalUldegdel)}</td>
              </tr>
            </React.Fragment>
          ))}

          <tr>
            <td colSpan={6} style={{ paddingTop: 30 }}>
              Хөтөлсөн нягтлан бодогч : __________________________
            </td>
            <td colSpan={9}>{data?.header?.accountant || ''}</td>
          </tr>
          <tr>
            <td colSpan={6}>
              Захирал: _________________________________________
            </td>
            <td colSpan={9}>{data?.header?.director || ''}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function AcctList(props){
    const { data, date, setDate, type, onSearch, loading, error, size, image} = props;

    const accountHtml = `
        <html>
        <head>
            <title>rpt_AccountStatement</title>
            <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"/>
            <style type="text/css">
                .csA999931B {color:#000000;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Arial; font-size: 11px; font-weight:normal; font-style:normal; }
                .cs8D49975B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right:#FFFFFF 1px solid;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:11px;padding-bottom:4px;}
                .cs7691293B {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-bottom:5px;}
                .csCCCC758 {color:#4A55A2;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#FFFFFF 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .csF7EB0CA5 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-bottom:5px;}
                .csE172C9E1 {color:#4A55A2;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .cs26E6DE06 {color:#4A55A2;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; padding-top:4px;padding-left:4px;padding-right:4px;padding-bottom:4px;}
                .csCCCBF907 {color:#5C6476;background-color:#EFF1F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .csB3335A17 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-bottom:5px;}
                .cs9C1F77F0 {color:#5C6476;background-color:#F5F5F5;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .cs376BE254 {color:#5C6476;background-color:#FFFFFF;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 11px; font-weight:normal; font-style:normal; }
                .csC2BCAF53 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-top:5px;padding-left:5px;padding-bottom:5px;}
                .cs423AC207 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 9px; font-weight:bold; font-style:normal; padding-top:4px;padding-left:4px;padding-bottom:4px;}
                .csBF6B980E {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:5px;padding-left:5px;padding-bottom:5px;}
                .csA8E73E03 {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .cs1E07F7AF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom:#E5E7EB 1px solid;font-family:Tahoma; font-size: 10px; font-weight:normal; font-style:normal; padding-top:5px;padding-left:5px;padding-right:5px;padding-bottom:5px;}
                .cs6497CDF {color:#5C6476;background-color:transparent;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:normal; font-style:normal; }
                .csA719B1F9 {color:#FFFFFF;background-color:#4A55A2;border-left-style: none;border-top-style: none;border-right-style: none;border-bottom-style: none;font-family:Tahoma; font-size: 12px; font-weight:bold; font-style:normal; padding-left:2px;padding-right:2px;}
                .csF7D3565D {height:0px;width:0px;overflow:hidden;font-size: 0px;line-height:0px;}
            </style>
        </head>
        <body leftMargin=10 topMargin=10 rightMargin=10 bottomMargin=10 style="background-color:#FFFFFF">
        <table cellpadding="0" cellspacing="0" border="0" style="border-width:0px;empty-cells:show;width:100%;height:493px;position:relative;">
            <tr style="vertical-align:top;">
                <td style="width:0px;height:10px;"></td>
                <td style="width:40px;"></td>
                <td style="width:60px;"></td>
                <td style="width:13px;"></td>
                <td style="width:77px;"></td>
                <td style="width:107px;"></td>
                <td style="width:103px;"></td>
                <td style="width:99px;"></td>
                <td style="width:7px;"></td>
                <td style="width:20px;"></td>
                <td style="width:48px;"></td>
                <td style="width:13px;"></td>
                <td style="width:25px;"></td>
                <td style="width:45px;"></td>
                <td style="width:61px;"></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:16px;"></td>
                <td class="csA999931B" colspan="5" rowspan="3" style="width:350px;height:50px;text-align:left;vertical-align:top;">
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
                <td class="csA719B1F9" colspan="14" style="width:714px;height:30px;line-height:14px;text-align:center;vertical-align:middle;"><nobr>ДАНСНЫ&nbsp;ХУУЛГА</nobr></td>
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
                <td class="cs7691293B" style="width:36px;height:22px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>№</nobr></td>
                <td class="cs7691293B" colspan="2" style="width:69px;height:22px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Огноо</nobr></td>
                <td class="cs7691293B" colspan="2" style="width:180px;height:22px;line-height:13px;text-align:left;vertical-align:middle;"><nobr>Гүйлгээний&nbsp;утга</nobr></td>
                <td class="csCCCC758" style="width:95px;height:22px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>Харилцагч</nobr></td>
                <td class="csCCCC758" colspan="2" style="width:97px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Орлого</nobr></td>
                <td class="csCCCC758" colspan="4" style="width:98px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Зарлага</nobr></td>
                <td class="csCCCC758" colspan="2" style="width:98px;height:22px;line-height:13px;text-align:right;vertical-align:middle;"><nobr>Үлдэгдэл</nobr></td>
            </tr>
            ${data?.newData?.map(item => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csF7EB0CA5" colspan="8" style="width:502px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${item?.acct}</td>
                <td class="csF7EB0CA5" colspan="4" style="width:102px;height:10px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>Эхний&nbsp;үлдэгдэл&nbsp;:</nobr></td>
                <td class="csE172C9E1" colspan="2" style="width:98px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(item?.baseUldegdel)}</td>
            </tr>
            ${item?.curyID !== 'MNT' ? `<tr style="vertical-align:top;">
                <td style="width:0px;height:18px;"></td>
                <td class="csC2BCAF53" colspan="8" style="width:502px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs1E07F7AF" colspan="4" style="width:93px;height:9px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="csE172C9E1" colspan="2" style="width:98px;height:9px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>` : ''}
            ${item?.itemData?.map(list => `
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csBF6B980E" style="width:36px;height:10px;line-height:11px;text-align:left;vertical-align:middle;"><nobr>${list?.no}</nobr></td>
                <td class="csBF6B980E" colspan="2" style="width:69px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.txnDate}</td>
                <td class="csBF6B980E" colspan="2" style="width:180px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.txnDescr}</td>
                <td class="csBF6B980E" style="width:99px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${list?.custName}</td>
                <td class="csA8E73E03" colspan="2" style="width:98px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.orlogo)}</td>
                <td class="csA8E73E03" colspan="4" style="width:98px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.zarlaga)}</td>
                <td class="csA8E73E03" colspan="2" style="width:98px;height:10px;text-align:right;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]-->${formatNumber2(list?.uldegdel)}</td>
            </tr>
            `
            ).join("")}
            ${item?.curyID !== 'MNT' ? `<tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs1E07F7AF" colspan="6" style="width:387px;height:10px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="csCCCBF907" colspan="2" style="width:98px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csCCCBF907" colspan="4" style="width:98px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="csCCCBF907" colspan="2" style="width:98px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
            </tr>` : ''}
            <tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="csB3335A17" colspan="6" style="width:396px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs9C1F77F0" colspan="2" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>${formatNumber2(item?.totalOrlogo)}</nobr></td>
                <td class="cs9C1F77F0" colspan="4" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>${formatNumber2(item?.totalZarlaga)}</nobr></td>
                <td class="cs9C1F77F0" colspan="2" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr>${formatNumber2(item?.totalUldegdel)}</nobr></td>
            </tr>
            ${item?.curyID !== 'MNT' ? `<tr style="vertical-align:top;">
                <td style="width:0px;height:19px;"></td>
                <td class="cs423AC207" colspan="5" style="width:293px;height:10px;"><!--[if lte IE 7]><div class="csF7D3565D"></div><![endif]--></td>
                <td class="cs1E07F7AF" style="width:90px;height:10px;line-height:10px;text-align:right;vertical-align:middle;"><nobr>валютаар</nobr></td>
                <td class="cs9C1F77F0" colspan="2" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr></nobr></td>
                <td class="cs9C1F77F0" colspan="4" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr></nobr></td>
                <td class="cs9C1F77F0" colspan="2" style="width:98px;height:10px;line-height:11px;text-align:right;vertical-align:middle;"><nobr></nobr></td>
            </tr>` : ''}`
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
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="2" style="width:300px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Хөтөлсөн&nbsp;нягтлан&nbsp;бодогч&nbsp;:&nbsp;__________________________</nobr></td>
                <td class="cs376BE254" colspan="6" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.accountant || ''}</nobr></td>
                <td></td>
            </tr>
            <tr style="vertical-align:top;">
                <td style="width:0px;height:30px;"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td class="cs376BE254" colspan="2" style="width:337px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"><nobr>Захирал:&nbsp;_________________________________________</nobr></td>
                <td class="cs376BE254" colspan="6" style="width:178px;height:29px;line-height:14px;text-align:left;vertical-align:middle;"> <nobr>${data?.header?.director || ''}</nobr></td>
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
            </tr>
        </table>
        </body>
        </html>`;

    
    const filterProps = {date, setDate, type, onSearch, loading, error, size, id:'acct_to_pdf', html: accountHtml};
    const emptyProps = { icon: 'MdReceipt', id: 'fi_empBack'};

  return (
    <div>
        <Filter {...filterProps}/>
        {data?.newData?.length ? <div className="fi_pdf_back1" id='list_scroll' >
            <div className='list_pdf_back' id='acct_to_pdf'>
                {parse(accountHtml)}
                {/* <AccountStatement data={data} image={image}/> */}
            </div>
        </div> : <Empty1 {...emptyProps}/>}
    </div>
  );
}