import React, { useEffect, useState } from "react";
import { SizeMe } from "react-sizeme";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { Filter, WorkList, GljournalList, JournalList, AcctList, BalanceList } from "../../../../components/finance/report/general_journal";
import '../../../../css/finance.css';
import { sendRequest } from "../../../../../services";

export function GeneralJournal() {
    const [data, setData] = useState();
    const [balData, setBalData] = useState();
    const [acctData, setAcctData] = useState();
    const [journalData, setJournalData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [date, setDate] = useState([moment().startOf('month'), moment()]);
    const [type, setType] = useState('uspgl_JournalBalanceReport');
    const { user, token } = useSelector((state) => state.login);
    const dispatch = useDispatch();

    useEffect(() => {
        let query = {
            storedName: type, moduleID: "IN", 
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
        let response = query?.storedName === 'uspgl_ReportJournalList' && await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        let response1 = query?.storedName === 'uspgl_JournalBalanceReport' && await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        let response2 = query?.storedName === 'uspgl_Report_AccountStatement' && await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        let response3 = query?.storedName === 'uspgl_ReportGLJournal' && await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        let response4 = query?.storedName === 'uspgl_WorkSheet' && await dispatch(sendRequest(user, token, 'Integration/ExecStrored', query));
        console.log(response4);
        if(response?.error) setError(response?.error );
        else {
            const newData = [];
            response?.data?.header?.forEach(item => {
                const relatedDtl = response?.data?.dtl?.filter(d => d.journalID === item.journalID);
                const totalDr = relatedDtl.reduce((sum, item) => sum + item.drAmt, 0);
                const totalCr = relatedDtl.reduce((sum, item) => sum + item.crAmt, 0);
                newData.push({...item, dtl: relatedDtl, totalDr, totalCr })
            })
            let header = null;
            response?.data?.company?.forEach(item => {
                header = {cmpName: item?.companyName, dateRange: item?.dateRange}
            })
            setData({newData, header});
        }
        if(response1?.error) setError(response1?.error );
        else {
            let totalDr = 0, totalCr = 0, totalEDr = 0, totalECr = 0, totalBDr = 0, totalBCr = 0;
            const newData = [];
            response1?.data?.journal?.forEach(item => {
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
            response1?.data?.company?.forEach(item => {
                header = {cmpName: item?.companyName, dateRange: item?.dateRange}
            })
            setBalData({data: newData, totalDr, totalCr, totalECr,totalEDr, totalBDr, totalBCr, header});
        }
        if(response2?.error) setError(response2?.error );
        else {
            const newData = [];
            response2?.data?.detail?.forEach(item => {
                let grpData = newData.find(g => g.acctID === item.acctID);
                if (!grpData) {
                    grpData = { acctID: item.acctID, acct: item?.acct, baseUldegdel: item?.baseUldegdel, 
                                totalOrlogo:0, totalUldegdel:0, totalZarlaga: 0, curyID: item?.curyID, itemData: [] };
                    newData.push(grpData);
                }          
                grpData.itemData.push(item);
                grpData.totalOrlogo += item?.orlogo
                grpData.totalZarlaga += item?.zarlaga
                grpData.totalUldegdel += item?.uldegdel

                grpData?.itemData.forEach((item, index) => {
                    item.no = index + 1;
                });   
            });
            let header = null;
            response2?.data?.header?.forEach(item => {
                header = {cmpName: item?.companyName, dateRange: item?.dateRange}
            })
            setAcctData({newData, header});
        }
        if(response3?.error) setError(response3?.error );
        else {
            const newData = [];
            response3?.data?.detail?.forEach(item => {
                let grpData = newData.find(g => g.acctID === item.acctID);
                if (!grpData) {
                    grpData = { acctID: item.acctID, acct: item?.acct, baseUldegdel: item?.beginBalance, itemData: [] };
                    newData.push(grpData);
                }          
                grpData.itemData.push(item);
            });
            let header = null;
            response3?.data?.company?.forEach(item => {
                header = {cmpName: item?.companyName, dateRange: item?.dateRange}
            })
            setJournalData({data: newData, header});
        }
        setLoading(false);
    };
    
    const filterProps = {date, setDate, type, setType, onSearch: getData, loading, error};

    return (
        <div className="s_container_f" >
            <SizeMe>
            {({ size }) => (
                <div>
                <Filter size={size} {...filterProps}/>
                {type === 'uspgl_JournalBalanceReport' ? <BalanceList size={size} data={balData}/> : 
                 type === 'uspgl_Report_AccountStatement' ? <AcctList size={size} data={acctData}/> : 
                 type === 'uspgl_ReportGLJournal' ? <JournalList size={size} data={journalData}/> : 
                 type === 'uspgl_ReportJournalList' ? <GljournalList size={size} data={data}/> : 
                 type === 'uspgl_WorkSheet' ? <WorkList size={size} data={data}/> : ''}
                </div>
            )}
            </SizeMe>
        </div>
    );
}
