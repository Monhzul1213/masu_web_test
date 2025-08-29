import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { WorkList } from "../../../../components/finance/report/general_journal";
import '../../../../css/finance.css';
import { sendRequest } from "../../../../../services";

export function WorkSheet() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [date, setDate] = useState([moment().startOf('month'), moment()]);
    const { user, token } = useSelector((state) => state.login);
    const dispatch = useDispatch();

    useEffect(() => {
        let query = {
            storedName: 'uspgl_WorkSheet', moduleID: "IN", 
            business: [
                {fieldName: "BeginDate", value: date[0]?.format('yyyy.MM.DD')},
                {fieldName: "EndDate", value: date[1]?.format('yyyy.MM.DD')}
        ]};
        getData(query);
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    const getData = async (query) => {
        setLoading(true);
        let response = await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        if(response?.error) setError(response?.error );
        else {
            // const newData = [];
            // response?.data?.header?.forEach(item => {
            //     const relatedDtl = response?.data?.dtl?.filter(d => d.journalID === item.journalID);
            //     const totalDr = relatedDtl.reduce((sum, item) => sum + item.drAmt, 0);
            //     const totalCr = relatedDtl.reduce((sum, item) => sum + item.crAmt, 0);
            //     newData.push({...item, dtl: relatedDtl, totalDr, totalCr })
            // })
            // let header = null;
            // response?.data?.company?.forEach(item => {
            //     header = {cmpName: item?.companyName, dateRange: item?.dateRange}
            // })
            setData(response?.data);
        }
        setLoading(false);
    };
    
    
    const filterProps = {date, setDate, type: 'uspgl_WorkSheet', onSearch: getData, loading, error};

    return (
        <div className="s_container_f" >
            <SizeMe>
            {({ size }) => (
                <WorkList size={size} data={data} {...filterProps}/>
            )}
            </SizeMe>
        </div>
    );
}
