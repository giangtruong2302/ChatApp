import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [avatarCurrentUser, setDataCurrentUser] = useState('');
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setDataCurrentUser(data.avatarImage)
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const [image, setImage] = useState(null)

  useEffect(() => {
    const handlePaste = (evt) => {
      const clipboardItems = Array.from(evt.clipboardData?.items || [])
      const items = clipboardItems.filter((item) => item.type.indexOf('image') !== -1)

      if (items.length === 0) {
        return
      }

      const item = items[0]
      const blob = item.getAsFile()

      const imageEle = document.getElementById('preview')
      if (imageEle && blob) {
        imageEle.src = URL.createObjectURL(blob)
        setImage(imageEle.src)
        console.log('check img ele: ', imageEle)

        const formData = new FormData()
        formData.append('image', blob, 'filename')

        const req = new XMLHttpRequest()
        req.open('POST', '/path/to/back-end', true)

        req.onload = function () {
          if (req.status >= 200 && req.status < 400) {
            const res = req.responseText
            // Do something with the response
            // ...
          }
        }

        req.send(formData)
      }
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])
  return (
    <Container haveImg={image}>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"
                  }`}
              >
                <div className="message-content" style={{ flexDirection: message.fromSelf ? 'row-reverse' : 'row' }}>
                  <img src={`data:image/svg+xml;base64,${message.fromSelf ? avatarCurrentUser : currentChat.avatarImage}`} alt={message.message} className="img-msg" />
                  <div className="content ">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} imagePreview={image} onClearImage={setImage} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  ${props => !props.haveImg ? 'grid-template-rows: 10% 80% 10%;' : 'grid-template-rows: 10% 70% 20%;'}
  gap: 0.1rem;
  overflow: auto;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  @media screen and (max-width: 768px){
    grid-template-rows: 15% 70% 15%;
    height: 100vh;

  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #0d0d30;
    box-shadow: 0px 4px 4px rgba(146, 143, 143, 0.25);
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      :hover{
        /* background-color: #f5f5f5; */
      }
      .message-content{
        display: flex;
        gap: 5px;
        align-items: center;
        width: 100%;
        .img-msg{
          max-width: 30px;
          max-height: 30px;
          object-fit: cover;
        }
        .content {
        max-width: 100%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        @media screen and (max-width: 768px){
         max-width :100% ;
        }
      }
      }

    }
    .sended {
      display: flex;
      justify-content: flex-end;
      max-width: 100%;
      overflow-wrap: break-word;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      display: flex;
      justify-content: flex-start;
      max-width: 100%;
      overflow-wrap: break-word;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
