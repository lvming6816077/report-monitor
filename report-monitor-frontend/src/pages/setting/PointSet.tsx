import React, { useState, useEffect } from 'react'
import { Button, Col, Row, Modal, Form, Alert, Tree } from 'antd';
import { message } from 'antd';
import axios from 'axios'
import moment from 'moment';
import './PointSet.less'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PlusSquareOutlined } from '@ant-design/icons';


export const PointSet: React.FC = () => {


    const [treeData, setTreeData] = useState<TreeItem[]>([])
    const [codes,setCodes] = useState<string[]>()

    const history = useHistory()


    const saveData = async()=>{

        const result = await axios.post('/rapi/point/savePointSet',{
            codes:codes?.filter(i=>!isNaN(Number(i)))
        });
        if (result.data.code == 0) {
            message.success('保存成功')
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('/rapi/point/getPointsAndPointset');
            setTreeData(result.data.data.list)
            setCodes(result.data.data.pointset.split(','))
        }
        fetchData();
    }, []);
    const tProps = {

        treeData: treeData.filter(o => o.children.length),
        onCheck: (v: any) => {
            setCodes(v)
        },
        multiple: true,
        defaultExpandAll: true,
        checkable: true,
        checkedKeys:codes,
        // checkStrictly:true,
        // showCheckedStrategy: TreeSelect.SHOW_CHILD,
        // placeholder: '请勾选数据点',

    };

    return (
        <>
            <div className='page-title'>预设数据点</div>
            <div className='pointset-content'>
                <div>
                    <Alert message="在此页面进行数据点预设配置，将会在首页默认展示这个数据点的统计数据" type="warning" showIcon />
                </div>
                <div className='tree-content'>
                    {treeData.length ? <Tree
                            {...tProps}
                        />: null}
                </div>
                <div className='btn'>
                    <Button type="primary"  onClick={saveData}>保存</Button>
                </div>


            </div>
        </>
    )
}
