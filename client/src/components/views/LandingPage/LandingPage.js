import React, { useEffect, useState } from 'react';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import Axios from 'axios';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
    const [Videos, setVideos] = useState([]);  // [] : array

    useEffect(() => {   // DOM이 로드되자마자 무엇을 할 것인지
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setVideos(response.data.videos);
                } else {
                    alert('비디오를 가져오는데 실패했습니다!');
                }
            })
    }, []);  // 2번째 인자 : [] = 1번, 비우기 = 무한

    const renderCards = Videos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
                {/*column 하나 가로 크기 : 가장 클 때 = 6*4개, 미디움 = 8*3개, 가장 작을 때 = 24*1개 */}
                    <div style={{ position: 'relative' }}>
                        <a href={`/video/${video._id}`} > 
                        <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className=" duration">
                            <span>{minutes} : {seconds}</span>
                        </div>
                        </a>
                    </div><br />
                    <Meta
                        avatar={
                            <Avatar src={video.writer.image} />
                        }
                        title={video.title}
                        description=""
                    />
                    <span>{video.writer.name} </span><br />
                    <span style={{ marginLeft: '3rem' }}> {video.views}</span>
                    - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
                </Col>
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />

            <Row gutter={16}>
                {renderCards}
            </Row>
        </div>
    );
}

export default LandingPage
