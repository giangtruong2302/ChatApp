import React from "react";
import styled from "styled-components";
import Closeicon from "../assets/90-904785_png-file-svg-close-button-icon-png-transparent.png";
const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  font-weight: bold;
  margin-top: 0;
`;
const ModalBody = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ModalButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  background-color: #fff;
  border: 1px solid #333;
  color: #333;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 16px;
  border-radius: 4px;
  &:hover {
    background-color: #333;
    color: #fff;
  }
`;
const ModalButtonConfirm = styled.button`
  background-color: #10cd29;
  border: 1px solid #fff;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 16px;
  border-radius: 4px;
  &:hover {
    background-color: transparent;
    color: #333;
  border: 1px solid #333;

  }
`;

// type ModalConfirmProps = {
//   title: string;
//   message: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// };

const ModalConfirm = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>{title} <span onClick={onCancel}>
          <img src={Closeicon} style={{ width: 20, height: 20, objectFit: 'cover', cursor: 'pointer' }} alt="" />
        </span></ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalButtonWrapper>
          <ModalButton onClick={onCancel}>Cancel</ModalButton>
          <ModalButtonConfirm onClick={onConfirm}>Confirm</ModalButtonConfirm>
        </ModalButtonWrapper>
      </ModalContent>
    </ModalWrapper>
  );
};

export default ModalConfirm;