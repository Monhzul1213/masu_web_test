import { add } from "./add";
import { formatNumber } from "./helper";

export function getPrintHtml(merchant, data, amt, currency){
  console.log(merchant, data, amt, currency)
  const css = `
      <head>
        <style type='text/css'>
          body { width:680px; margin:10px 0px 60px 0; padding:0px;}
          .dashed { border: none; border-bottom: 2px solid black; border-bottom-style: dashed; margin: 3px 0; }
          .solid { border: none; border-bottom: 1px solid black; border-bottom-style: solid; margin: 3px 0; }
          .h_row tr {
            display: table-cell;
          }
          .h_row{
            margin-left: 10px ;
          }
          .h_text{
            margin: 10px 0 0 30px;
          }
          .qr{
            margin: 30px
          }
        </style>
      </head>
      <body>`;
    const title = `
      <table style="width: 100%">
        <tr><td colspan="2" style="font-size: 20px;font-weight:900; margin: 4px 0px 10px 0;">
          <center style="font-size: 20px;font-weight:900; margin: 0 0 10px 0">ТӨЛБӨРИЙН БАРИМТ</center>
        </td></tr>
        <tr><td colspan="4"><div class="solid" /></td></tr>
      </table>
      <table class="h_row" style="width: 100%">
        <tr >
          <td width="190px" style="font-size: 16px;padding: 0px 0px 3px 0; width: 60px">ДДТД:</td>
          <td style="font-size: 16px;padding: 0px 0px 3px 0;">`+ merchant?.ebarimtdata?.billId +`</td>
        </tr>
        <tr >
          <td width="190px" style="font-size: 16px;padding: 0px 0px 3px 0; width: 60px">Огноо:</td>
          <td style="font-size: 16px;padding: 0px 0px 3px 0;">`+ merchant?.merchant?.createdDate +`</td>
        </tr>
      </table>`;
    const info = `
      <table style="width: 100%" class="h_text">
          <tr>
            <th colspan="2" style="font-size: 16px;padding: 0px 0px 3px 0; width: 250px">Хүлээн авагч байгууллага: </td>
            <th colspan="2" style="font-size: 16px;padding: 0px 0px 3px 20px; width: 250px">Худалдан авагч байгууллага: </td>
          </tr>
          <tr>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Нэр: </td>
            <td style="font-size: 16px;font-weight: 550; padding: 0px 0px 3px 0;">МасуПос</td>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Нэр: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">`+ merchant?.merchant?.Name +`</td>
          </tr>
          <tr>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Хаяг: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">Twin Tower2, 11давхар</td>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Имэйл: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">`+ merchant?.merchant?.Email +`</td>
          </tr>
          <tr>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Утас: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">95092022</td>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Хаяг: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">`+ merchant?.merchant?.Address +`</td>
          </tr>
          <tr>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Банк: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">Хаан банк</td>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Утас: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">`+ merchant?.merchant?.Phone +`</td>
          </tr>
          <tr>
            <td style="font-size: 16px;padding: 0px 0px 3px 0; width: 50px">Данс: </td>
            <td style="font-size: 16px;font-weight: 550;padding: 0px 0px 3px 0;">5011703186</td>
          </tr>
        ` +
    `</table>`
    let items = `<table style="width: 100%">
      <tr><td colspan="4"><div class="dashed" /></td></tr>
      <tr style="padding: 0">
        <td style="font-size: 15px; text-align: center; font-weight: 600; min-width: 120px">Нэр</td>
        <td style="font-size: 15px; text-align: center; font-weight: 600; min-width: 60px">Үйлчилгээний нэр</td>
        <td style="font-size: 15px; text-align: center; font-weight: 600; min-width: 90px">Хугацаа</td>
        <td style="font-size: 15px; text-align: center; font-weight: 600; min-width: 90px">Дүн</td><tr><td colspan="4"><div class="dashed" /></td></tr>
      </tr>
    `;
    data?.map(item => {
      items += `
      <tr style="padding: 0">
        <td style="font-size: 15px; text-align: left; min-width: 120px">` + item?.Name + `</td>
        <td style="font-size: 15px; text-align: center; min-width: 60px">` + item?.SubscriptionName + `</td>
        <td style="font-size: 15px; text-align: center; min-width: 90px">` + item?.SubscriptionTimeName + `</td>
        <td style="font-size: 15px; text-align: right; min-width: 90px">` + formatNumber(item?.Amount) + currency + `</td>
      </tr>
      `;
    });
    items += `</table>`;
    const total = `
      <table style="width: 100%">
        <tr><td colspan="4"><div class="dashed" /></td></tr>
        <tr>
        <td colspan="3" width="190px" style="font-size: 16px;padding: 0px 0px 3px 0; font-weight:700; text-align: right; width: 190px">Нийт</td>
        <td width="190px" style="font-size: 16px;padding: 0px 0px 3px 0; font-weight:700; width: 190px; text-align: right">`
            + formatNumber(merchant?.ebarimtdata?.Amount) + currency + `</td>
        </tr>
        <tr><td colspan="4"><div class="dashed" /></td></tr>
      </table>`;
    let qr = '';
      qr += `
        <table width="100%" style="width: 100%;">
          <tr>
            <td width="200px" class="qr">
              <img src=\"data: `+ merchant?.ebarimtdata?.qrData +`;base64,[:QRDATA]\" style="height: 200px; width: 200px">
            </td>
            <td width="180px">
              <p style="font-size: 16px; margin: 0; font-weight: 700">`
                + 'Сугалааны дугаар' +
              `:</p>
              <p style="font-size: 16px; margin: 0 0 10px 0;">`
                + merchant?.ebarimtdata?.lottery +
              `</p>
              <p style="font-size: 16px; margin: 0; font-weight: 700">`
                + 'Бүртгүүлэх дүн' +
              `:</p>
              <p style="font-size: 16px; margin: 0 0 10px 0;">`
                + (formatNumber(amt) + currency) +
              `</p>
            </td>
          </tr>
        </table>`;
    return '<html>' + css + title + info + items + total + qr + '</body></html>';
}