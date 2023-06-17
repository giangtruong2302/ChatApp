import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { MdOutlineArrowBack } from 'react-icons/md';
export default function Contacts({ contacts, changeChat, mobileContact, onChangeMobileContact }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentSelected !== undefined && (
        <HambugerIcon onClick={() => { onChangeMobileContact(!mobileContact); setCurrentSelected(undefined) }}>
          <MdOutlineArrowBack color="#fff" size={28} />
        </HambugerIcon>
      )}
      {currentUserImage && currentUserImage && (
        <Container mobileContact={mobileContact}>
          <div className="brand" onClick={() => changeChat(undefined)}>
            <img src={Logo} alt="logo" />
            <h3>Glopr Chat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => { changeCurrentChat(index, contact); onChangeMobileContact(false) }}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const HambugerIcon = styled.div`
display: none;
@media screen and (max-width: 768px){
  display: flex;
  position: absolute;
top:10px;
left: 10px;
}
`
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  @media screen and (max-width: 768px) {
     ${props => !props.mobileContact ? 'height: 0;' : 'height:100vh'}

    .contacts {
      transform: translateX(${props => (props.mobileContact ? "0" : "-100%")});
      transition: transform 1000ms ease-in-out;
    }
    .current-user{
      transform: translateX(${props => (props.mobileContact ? "0" : "-100%")});
      transition: transform 500ms ease-in-out;
    }
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    cursor: pointer;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media screen and (max-width: 768px) {
    ${props => !props.mobileContact ? 'height: 0;' : 'height:100vh'}
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 1s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
