import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo() {
    const [sideVideos, setsideVideos] = useState([]);
    
    useEffect(() => {   // DOM이 로드되자마자 무엇을 할 것인지
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setsideVideos(response.data.videos);
                } else {
                    alert('비디오를 가져오는데 실패했습니다!');
                }
            })
    }, []);  // 2번째 인자 : [] = 1번, 비우기 = 무한

    const renderSideVideo = sideVideos.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <div key={index} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
            <div style={{ width: '40%', marginRight: '1rem' }}>
                <a href >
                    <img style={{ width: '100%', height: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                </a>
            </div>

            <div style={{ width: '50%', marginRight: '1rem' }}>
                <a href stype={{ color: 'gray' }}>
                    <span style={{ fontSize: '1rem', color:'black' }}>{video.title} </span><br />
                    <span>{video.writer.name} </span><br />
                    <span>{video.views} views </span><br />
                    <span>{minutes} : {seconds} </span><br />
                </a>
            </div>
        </div>
    });

    return (
        <React.Fragment>
            <div stype={{ marginTop: '3rem'}} />
            {renderSideVideo}
        </React.Fragment>
        
    )
}

export default SideVideo
