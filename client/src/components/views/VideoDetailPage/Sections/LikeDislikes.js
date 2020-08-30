import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);

    let variable = {};
    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId };
    } else {
        variable = { commentId: props.commentId, userId: props.userId };
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if (response.data.success) {
                    setLikes(response.data.likes.length);   // 좋아요 수
                    
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) { // 이미 좋아요 누름
                            setLikeAction('liked');
                        }
                    })
                } else {
                    alert('Likes 정보를 가져오는데 실패했습니다!');
                }
            });

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(response.data.dislikes.length);   // 싫아요 수
                    
                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) { // 이미 싫아요 누름
                            setDislikeAction('disliked');
                        }
                    })
                } else {
                    alert('Dislikes 정보를 가져오는데 실패했습니다!');
                }
            });
    }, []);

    const onLike = () => {
        if (LikeAction === null) {  // 좋아요 클릭 X
            Axios.post('/api/like/upLike', variable)  
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');

                        if (DislikeAction !== null) {   // 싫어요 클릭
                            setDislikes(Dislikes - 1);
                            setDislikeAction(null);
                        }
                    } else {
                        alert('Like을 하지 못하였습니다!');
                    }
                });
        } else {    // 좋아요 클릭
            Axios.post('/api/like/unLike', variable)  
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    } else {
                        alert('Like을 취소하지 못하였습니다!');
                    }
                });
        }
    };

    const onDislike = () => {
        if (DislikeAction === null) {  // 싫어요 클릭 X
            Axios.post('/api/like/upDislike', variable)  
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1);
                        setDislikeAction('disliked');

                        if (LikeAction !== null) {   // 좋어요 클릭
                            setLikes(Likes - 1);
                            setLikeAction(null);
                        }
                    } else {
                        alert('Dislike을 하지 못하였습니다!');
                    }
                });
        } else {    // 싫아요 클릭
            Axios.post('/api/like/unDisike', variable)  
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes - 1);
                        setDislikeAction(null);
                    } else {
                        alert('Dislike을 취소하지 못하였습니다!');
                    }
                });
        }
    };

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Dislikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
