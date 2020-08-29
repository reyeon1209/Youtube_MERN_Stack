import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscriber';

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId; // app.js의 Route path의 videoId
    const variable = { videoId: videoId };

    const [VideoDetails, setVideoDetails] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetails', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetails(response.data.videoDetails);
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다!')
                }
            })
    }, [])

    if (VideoDetails.writer) {
        const subscribeButton = VideoDetails.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetails.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24} >
                <div style={{ width: '100%', padding: '3rem 4rem' }}>
                    <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetails.filePath}`} controls />
                    <List.Item
                        actions={[subscribeButton]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={VideoDetails.writer.image} />}
                            title={VideoDetails.writer.name}
                            description={VideoDetails.description}
                        />
                    </List.Item>
    
                    {/* Comments */}
                </div>
                </Col>
                <Col lg={6} xs={24} >
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (
            <div>Loading...</div>
        )
    }
}

export default VideoDetailPage
