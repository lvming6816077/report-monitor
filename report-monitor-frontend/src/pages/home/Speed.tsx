import React, { useState, useEffect, useCallback } from 'react'
// import Counter from '../components/counter/Counter'
import { Button, Col, Empty, Row, Spin, TreeSelect } from 'antd'
import axios from 'axios'
import './Speed.less'
import { SItem } from './sitem/SItem'
import { Loading3QuartersOutlined } from '@ant-design/icons'
import { ChartDataItem } from './sitem/SItem'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const antIcon = <Loading3QuartersOutlined style={{ fontSize: 24 }} spin />

export type ChartListItemType = {
    code: string
    desc: string
    list: ChartDataItem[]
}
export const Speed: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo)
    const [treeData, setTreeData] = useState<TreeItem[]>([])
    const [codes, setCodes] = useState<string[]>([])
    const [chartList, setChartList] = useState<ChartListItemType[][]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [noData, setNoData] = useState<boolean>(false)
    
    const changeData = (cur: [], code: string) => {
        let cls = JSON.parse(JSON.stringify(chartList))
        let m = cls.length,
            n = cls[0].length
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (cls[i][j] && cls[i][j].code == code) {
                    cls[i][j].list = cur
                }
            }
        }
        setChartList(cls)
    }
    const renderChartContent = useCallback(() => {
        return chartList?.map((o, index) => {
            return (
                <Row key={index}>
                    {o.map((k) => {
                        return (
                            <Col span={8} key={k.code}>
                                <SItem
                                    data={k.list}
                                    code={k.code}
                                    desc={k.desc}
                                    changeData={changeData}
                                ></SItem>
                            </Col>
                        )
                    })}
                </Row>
            )
        })
    }, [chartList])

    const getChartData = (_codes: string[]) => {
        const fetchData = async () => {
            setLoading(true)
            const result = await axios.post(
                '/rapi/report/getSpeedsGroupToday',
                {
                    codes: _codes,
                }
            )

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
            const result = await axios.get('/rapi/speed/getSpeedsAndSpeedset?projectId='+userInfo.activePid)
            const d = result.data.data
            if (d.list.length == 0) {
                setNoData(true)
                return
            }
            setTreeData(d.list)
            if (d.speedset) {
                let codes = d.speedset.split(',')
                setCodes(d.speedset.split(','))
                getChartData(codes)
            }
        }
        fetchData()
    }, [])

    const tProps = {
        treeData: treeData.filter((o) => o.children.length),
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
    }

    return (
        <div className="speed-home-content">
            <div className="page-title">数据展示</div>
            <div className="point-select">
                {!noData ? (
                    <Row justify="center" align="middle">
                        <Col span={20}>
                            <TreeSelect {...tProps} />
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                className="submit-btn"
                                onClick={() => {
                                    getChartData(codes)
                                }}
                            >
                                查看
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    <Empty
                        style={{ marginTop: 10 }}
                        description={
                            <span>
                                还没测速点，快去
                                <Link to={'/speed/createspeed'}>创建</Link>吧
                            </span>
                        }
                    />
                )}
            </div>
            <div className="chart-content">
                {!loading ? renderChartContent() : <Spin indicator={antIcon} />}
            </div>
        </div>
    )
}
