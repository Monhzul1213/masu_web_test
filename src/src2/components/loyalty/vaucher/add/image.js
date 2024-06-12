import React from "react";
import "./image.css";
import moment from "moment";
import { formatNumber } from "../../../../../helpers";
import { DynamicRIIcon } from "../../../../../src1/components/all/all_m";
export function VoucherImage(props) {
  return (
    <>
      {props?.color?.value && (
        <div
          style={{
            width: "400px",
            height: "200px",
            backgroundColor: "#" + props?.color?.value,
            position: "relative",
            display: "flex",
          }}
        >
          <div className="circle">
            <div className="vou_position">
              <div className="vou_title_h">
                <div className="vou_title">{props?.user}</div>
                <div className="vou_title">{props?.name?.value}</div>
              </div>
            </div>
          </div>
          <div className="voucher_content">
            <div style={{ position: "absolute", marginTop: -10 }}>
              <div
                style={{
                  color: "#" + props?.color?.value,
                }}
                className="text_vo"
              >
                Ваучер
              </div>
            </div>
            <div className="voucher_content_title">
              <div className="vou_title_amt">
                {formatNumber(props?.price?.value)}{" "}
                <sup className="currencyHead">₮</sup>
                <div
                  style={{
                    width: 35,
                    height: 35,
                    position: "absolute",
                    right: "6%",
                    top: "45%",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#" + props?.color?.value,
                      borderRadius: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: 3,
                      borderStyle: "solid",
                      borderWidth: 2,
                      borderColor: "#ffffff",
                    }}
                  >
                    <span className="voucher_icon"></span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", paddingTop: 2 }}>
                <div style={{ display: "flex" }}>
                  <p
                    style={{
                      // color: "#c1a5c9",
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Ашигласан: {}
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: 12,
                      paddingLeft: 2,
                    }}
                  >
                    0
                    <sup>₮</sup>
                  </p>
                  {/* <sup
                    style={{
                      color: "white",
                      fontSize: 7,
                    }}
                    className="currency"
                  >
                    ₮
                  </sup> */}
                </div>
                <div style={{ display: "flex", paddingLeft: 8 }}>
                  <p
                    style={{
                      color: "white",
                      fontSize: 12,
                    }}
                  >
                    Үлдэгдэл:
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontSize: 12,
                      paddingLeft: 2,
                    }}
                  >
                    0 
                    <sup>₮</sup>
                  </p>
                  {/* <sup
                    style={{
                      color: "#ffffff",
                      // fontSize: 7,
                    }}
                    // className="currency"
                  >
                    ₮
                  </sup> */}
                </div>
              </div>
            </div>
            <div className="vou_content_footer">
              <div style={{ paddingTop: 0, paddingRight: 1 }}>
              <DynamicRIIcon name='RiCalendar2Line' style={{color: '#ffffff'}}/>
              </div>
              <div className="voucher_date">
                {moment(props?.endDate?.value)?.format("YYYY.MM.DD")} хүртэл
                хүчинтэй
              </div>
            </div>
          </div>
          <div className="imageLeft"></div>
          <div className="imageRight"></div>
        </div>
      )}
    </>
  );
}
