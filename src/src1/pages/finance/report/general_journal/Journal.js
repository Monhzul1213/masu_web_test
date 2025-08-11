import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { JournalList } from "../../../../components/finance/report/general_journal";
import '../../../../css/finance.css';
import { getList, sendRequest } from "../../../../../services";

export function Journal() {
    const [journalData, setJournalData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [date, setDate] = useState([moment().startOf('month'), moment()]);
    const [image, setImage] = useState(null);
    const { user, token } = useSelector((state) => state.login);
    const dispatch = useDispatch();

    useEffect(() => {
        let query = {
            storedName: 'uspgl_ReportGLJournal', moduleID: "IN", 
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
            const newData = [];
            response?.data?.detail?.forEach(item => {
                let grpData = newData.find(g => g.acctID === item.acctID);
                if (!grpData) {
                    grpData = { acctID: item.acctID, acct: item?.acct, baseUldegdel: item?.beginBalance, itemData: [] };
                    newData.push(grpData);
                }          
                grpData.itemData.push(item);
            });
            let header = null;
            response?.data?.company?.forEach(item => {header = item})
            setJournalData({data: newData, header});
        }
        setLoading(false);
    };
    
    const filterProps = {date, setDate, onSearch: getData, loading, error, type: 'uspgl_ReportGLJournal', image};

    return (
        <div className="s_container_f" >
            <SizeMe>
            {({ size }) => (
                <JournalList size={size} data={journalData} {...filterProps}/>
            )}
            </SizeMe>
        </div>
    );
}
