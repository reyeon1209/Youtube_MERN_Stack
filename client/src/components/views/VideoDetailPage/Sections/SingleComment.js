import React, { useState } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { Comment, Avatar } from 'antd';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
    const user = useSelector(state => state.user);
    const [CommentValue, setCommentValue] = useState("");
    const [OpenReply, setOpenReply] = useState(false);

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    };

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    };

    const onSubmit = (event) => {
        event.preventDefault(); // page refresh 안하게

        const variables = {
            writer: user.userData._id,  // redux에서 가져옴
            videoId: props.videoId,
            responseTo: props.comment._id,
            content: CommentValue
        };

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("");
                    onClickReplyOpen(!OpenReply);
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글을 저장하지 못했습니다!');
                }
            });
    };

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ];

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />
        
            {OpenReply && 
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="댓글을 작성해주세요"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
