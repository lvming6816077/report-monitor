import React, { useState, useEffect, useCallback } from 'react'
// import Counter from '../components/counter/Counter'
import { Button, Col, Row, Spin, TreeSelect } from 'antd';
import axios from 'axios'
import './Home.less'
import { CItem } from './citem/CItem';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import {ChartDataItem} from './citem/CItem'

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />;

export type ChartListItemType = {
    code:string,
    desc:string,
    list:ChartDataItem[]
}
export const Home: React.FC = () => {

    const [treeData, setTreeData] = useState<TreeItem[]>([])
    const [codes, setCodes] = useState<string[]>([])
    const [chartList, setChartList] = useState<ChartListItemType[][]>([])
    const [loading, setLoading] = useState<boolean>(false)


    const renderChartContent = useCallback(() => {
        return chartList?.map((o, index) => {
            return (
                <Row key={index}>
                    {
                        o.map(k => {
                            return (
                                <Col span={8} key={k.code}>
                                    <CItem data={k.list} code={k.code} desc={k.desc} changeData={changeData}></CItem>
                                </Col>
                            )
                        })
                    }
                </Row>
            )
        })
    }, [chartList])
    const changeData = (cur:[],code:string)=>{

        let cls = JSON.parse(JSON.stringify(chartList))
        let m = cls.length,n = cls[0].length
        for (let i = 0 ; i < m ; i++) {
            for (let j = 0 ; j < n ; j++) {
                if (cls[i][j].code == code) {
                    cls[i][j].list = cur
                }
            }
        }
        setChartList(cls)
    }
    const getChartData = (_codes:string[]) => {
        const fetchData = async () => {
            setLoading(true)
            const result = await axios.post('/rapi/report/getReportsGroupToday', {
                codes:_codes
            });

            let list = result.data.data

            let n = Math.ceil(list.length / 3)

            let r = []
            for (var i = 0; i < n; i++) {
                r.push(list.slice(i * 3, i * 3 + 3))
            }
            setChartList(r)
            setLoading(false)

        }
        fetchData()

    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/rapi/point/getPointsAndPointset');
            setTreeData(result.data.data.list)
            if (result.data.data.pointset) {
                let codes = result.data.data.pointset.split(',')
                setCodes(result.data.data.pointset.split(','))
                getChartData(codes)
            }
        }
        fetchData();
    }, []);

    const tProps = {

        treeData: treeData.filter(o => o.children.length),
        value: codes,
        onChange: (v: any) => {
            setCodes(v)
        },
        allowClear: true,
        multiple: true,
        treeDefaultExpandAll: true,
        treeCheckable: true,
        showCheckedStrategy: TreeSelect.SHOW_CHILD,
        placeholder: '请勾选数据点',
        style: {
            width: '100%',
        },
    };

    return (
        <div className='home-content'>
            <div className='page-title'>数据展示</div>
            <div className='point-select'>
                <Row justify='center' align='middle'>
                    <Col span={20}>
                        <TreeSelect {...tProps} />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" className='submit-btn' onClick={()=>{
                            getChartData(codes)
                        }}>查看</Button>
                    </Col>
                </Row>

            </div>
            <div className='chart-content'>
                {!loading ? renderChartContent() : <Spin indicator={antIcon} />}
            </div>
        </div>
    )
}
