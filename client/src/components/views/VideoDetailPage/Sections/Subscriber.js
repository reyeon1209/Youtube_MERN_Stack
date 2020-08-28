import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function Subscribe(props) {
    const userTo = props.userTo;
    const userFrom = props.userFrom;

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    const onSubscribe = () => {
        let subscribeVariables = {
            userTo : userTo,
            userFrom : userFrom
        };

        if (Subscribed) {   // 구독 중이라면
            Axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1); // 구독 수 - 1
                        setSubscribed(!Subscribed);  // 구독 -> 구독X 상태로 변경
                    } else {
                        alert('구독 취소에 실패했습니다!');
                    }
            });
        } else {    // 구독 중이 아니라면
            Axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1);    // 구독 수 + 1
                        setSubscribed(!Subscribed); // 구독X -> 구독 상태로 변경
                    } else {
                        alert('구독에 실패했습니다!');
                    }
            });
        }
    };

    useEffect(() => {
        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom };

        Axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber);
                } else {
                    alert('구독자 수 정보를 가져오지 못했습니다!');
                }
            });

        Axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed);
                } else {
                    alert('구독자 정보를 가져오지 못했습니다!');
                }
            });
    }, []);

    return (
        <div>
            <button 
            onClick={onSubscribe}
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
