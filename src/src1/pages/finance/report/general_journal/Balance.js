import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { BalanceList } from "../../../../components/finance/report/general_journal";
import '../../../../css/finance.css';
import { getList, sendRequest } from "../../../../../services";

export function Balance() {
    const [balData, setBalData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [date, setDate] = useState([moment().startOf('month'), moment()]);
    const [image, setImage] = useState(null);
    const { user, token } = useSelector((state) => state.login);
    const dispatch = useDispatch();

    useEffect(() => {
        let query = {
            storedName: 'uspgl_JournalBalanceReport', moduleID: "IN", 
            business: [
                {fieldName: "BeginDate", value: date[0]?.format('yyyy.MM.DD')},
                {fieldName: "EndDate", value: date[1]?.format('yyyy.MM.DD')}
        ]};
        getData(query);
        getImage();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const getImage = async () => {
        setLoading(true);
        let response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
        if(response?.error) setError(response?.error );
        else {
            setImage(response?.data?.fileRaw)
        }
        setLoading(false);
    };

    const getData = async (query) => {
        setLoading(true);
        let response = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        if(response?.error) setError(response?.error );
        else {
            let totalDr = 0, totalCr = 0, totalEDr = 0, totalECr = 0, totalBDr = 0, totalBCr = 0;
            const newData = [];
            response?.data?.journal?.forEach(item => {
                let group = newData.find(r => r.groupAcctParent === item.groupAcctParent);
                if (!group) {
                    group = { groupAcctParent: item.groupAcctParent, datas: [] };
                    newData.push(group);
                }
                let subGroup = group.datas.find(d => d.groupAcct === item.groupAcct);
                if (!subGroup) {
                    subGroup = { groupAcct: item.groupAcct, totalDrAmt: 0, totalCrAmt: 0,totalEcrAmt: 0,totalEdrAmt: 0,totalBdrAmt: 0,totalBcrAmt: 0, data: [] };
                    group.datas.push(subGroup);
                }
                subGroup.data.push(item);
                subGroup.totalDrAmt += item?.drAmt;
                subGroup.totalCrAmt += item?.crAmt;
                subGroup.totalEcrAmt += item?.eCrAmt;
                subGroup.totalEdrAmt += item?.eDrAmt;
                subGroup.totalBcrAmt += item?.bCrAmt;
                subGroup.totalBdrAmt += item?.bDrAmt;
            });
            newData?.forEach(group => {
                group?.datas?.forEach(item => {
                    totalDr += item.totalDrAmt;
                    totalCr += item.totalCrAmt;
                    totalEDr += item.totalEdrAmt;
                    totalECr += item.totalEcrAmt;
                    totalBDr += item.totalBdrAmt;
                    totalBCr += item.totalBcrAmt;
                });
            })
            let header = null;
            response?.data?.company?.forEach(item => {
                header = item
            })
            setBalData({data: newData, totalDr, totalCr, totalECr,totalEDr, totalBDr, totalBCr, header});
        }
        setLoading(false);
    };
    
    const filterProps = {date, setDate, type: 'uspgl_JournalBalanceReport', onSearch: getData, loading, error, image};

    return (
        <div className="s_container_f" style={{maxWidth: '297mm'}}>
            <SizeMe>
            {({ size }) => (
                <BalanceList size={size} data={balData} {...filterProps}/> 
            )}
            </SizeMe>
        </div>
    );
}
