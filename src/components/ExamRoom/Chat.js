import React, { useState, useEffect, useCallback, useRef } from 'react';
import Pusher from 'pusher-js';
import { GrAttachment } from 'react-icons/gr';
import * as PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  InputGroup,
  InputGroupAddon,
  Button,
  Form,
} from 'reactstrap';

import { ChatMessage, ChatContainer } from 'components/common/Chat';
import config from 'config/config';

import * as appointmentService from 'services/appointment';
import * as fileService from 'services/file';

import {
  FILE_TYPES,
  MESSAGE_TYPES,
  ONE_SECOND_IN_MILLISECONDS,
} from '../../constants';
import { IMAGE_TYPE_REGEX } from 'constants/regex';

import { downloadFileFromBlob } from 'utils/file';

const Chat = ({
  user,
  appointment,
  endAppointment,
  jitsiApi,
  openImageModal,
}) => {
  /* eslint-disable no-unused-vars */
  const [guest, setGuest] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [newMessage, setNewMessage] = useState({});
  const [subscribed, setSubscribed] = useState(false);
  const [isMessageSeen, setIsMessageSeen] = useState(true);
  const textInput = useRef();
  const fileInput = useRef();
  const chatContainerRef = useRef();

  const handleFilePaste = useCallback(
    async (e) => {
      const data = e.clipboardData || window.clipboardData;
      const file = data.files[0];

      if (!file) {
        return;
      }

      createChatFile(file);
    },
    [messages],
  );

  useEffect(() => {
    textInput.current.addEventListener('paste', handleFilePaste);

    return () =>
      textInput?.current?.removeEventListener('paste', handleFilePaste);
  }, [handleFilePaste]);

  useEffect(() => {
    if (Object.keys(newMessage).length) {
      setMessages([...messages, newMessage]);

      // This is a hack so that
      setTimeout(() => scrollChatToBottom(), ONE_SECOND_IN_MILLISECONDS);
    }
  }, [newMessage]);

  const handleMessageReceived = useCallback(
    (data) => {
      if (data.user.email === user.Email) {
        return;
      }

      if (data.messageType === MESSAGE_TYPES.FILE) {
        setNewMessage({
          user: data.user,
          message: data.message,
          fileType: data.fileType,
          messageType: data.messageType,
          fileName: data.message.replace(
            `${config.domainURL}/file/encounter/`,
            '',
          ),
        });

        return;
      }

      setNewMessage({
        user: data.user,
        message: data.message,
        messageType: data.messageType,
        fileType: data.fileType,
      });
    },
    [user.Email],
  );

  const subscribeToAppointment = useCallback(
    (user) => {
      if (!jitsiApi || subscribed) {
        return;
      }

      if (appointment.organizationEventBookingId) {
        const { key, cluster } = config.pusher;
        const pusher = new Pusher(key, {
          cluster,
          encrypted: true,
        });

        const appointmentChannel = pusher.subscribe(
          appointment.organizationEventBookingId.toLowerCase(),
        );

        appointmentChannel.bind('join', (data) => {
          if (data.user !== user) {
            setGuest(data.user);
            // @toDo add guest functionality
          }
        });

        appointmentChannel.bind('message', handleMessageReceived);

        // TODO: This logic should be moved to parent component
        appointmentChannel.bind('end', endAppointment);

        setSubscribed(true);

        // @todo: Pusher takes a few seconds to establish a connection.
        // so we need to wait a few seconds. This isn't a very good method.
        // Need to make this better.
        setTimeout(() => handleAppointmentStart(user), 3000);
      }
    },
    [appointment.organizationEventBookingId, jitsiApi],
  );

  const handleAppointmentStart = (user) => {
    appointmentService.startAppoinment({ user });
  };

  const fetchChatMessages = useCallback(async () => {
    try {
      const response = await appointmentService.getChatMessages(
        appointment.organizationEventBookingId,
      );

      let messages = response.data.messages;

      messages = messages.map((message) => {
        if (message.messageType === MESSAGE_TYPES.FILE) {
          return {
            ...message,
            fileName: message.message.replace(
              `${config.domainURL}/file/encounter/`,
              '',
            ),
          };
        }

        return message;
      });

      setMessages(messages);
      scrollChatToBottom();
    } catch (err) {
      // TODO: Handle error
    }
  }, [appointment.organizationEventBookingId]);

  useEffect(() => {
    if (appointment.organizationEventBookingId) {
      fetchChatMessages();
    }
  }, [fetchChatMessages, appointment.organizationEventBookingId]);

  useEffect(() => {
    if (user) {
      subscribeToAppointment(user.Email);
    }
  }, [user, subscribeToAppointment]);

  const handleChatSubmit = (e) => {
    e.preventDefault();

    const newMessages = [
      ...messages,
      {
        user: {
          id: user.NTOUserID,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
        },
        message: chatMessage,
        messageType: MESSAGE_TYPES.MESSAGE,
      },
    ];

    sendChatMessage({
      user: user.NTOUserID,
      message: chatMessage,
      appointment,
    });

    setMessages(newMessages);
    setChatMessage('');
  };

  const handleChatChange = (e) => {
    setChatMessage(e.target.value);
  };

  const sendChatMessage = async (payload) => {
    await appointmentService.sendChatMessage(payload);
    scrollChatToBottom();
  };

  const onClickFileUpload = () => {
    fileInput.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    createChatFile(file);
  };

  const createChatFile = async (file) => {
    try {
      const isFileImage = IMAGE_TYPE_REGEX.test(file.type);
      const fileType = isFileImage ? FILE_TYPES.IMAGE : FILE_TYPES.FILE;

      const response = await appointmentService.sendChatFile(
        file,
        user.NTOUserID,
        appointment,
        fileType,
      );

      const newMessages = [
        ...messages,
        {
          user: {
            id: user.NTOUserID,
            firstName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
          },
          message: response.data.file,
          messageType: MESSAGE_TYPES.FILE,
          fileType,
          fileName: response.data.file.replace(
            `${config.domainURL}/file/encounter/`,
            '',
          ),
        },
      ];

      setMessages(newMessages);
      scrollChatToBottom();
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await fileService.getEncounterFile(fileName);

      downloadFileFromBlob(response.data, fileName);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const scrollChatToBottom = () => {
    if (chatContainerRef && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 20;
    }
  };

  return (
    <div className="chat-container">
      <Card className="chat-card">
        <CardBody className="p-1">
          <ChatContainer
            chatContainerRef={chatContainerRef}
            scrollChatToBottom={scrollChatToBottom}>
            {messages &&
              messages.map((message, index) => {
                return (
                  <ChatMessage
                    key={`${message.message} - ${message.user.email} - ${index}`}
                    message={message}
                    user={user}
                    openImageModal={openImageModal}
                    handleFileDownload={handleFileDownload}
                  />
                );
              })}
          </ChatContainer>
        </CardBody>
        <Form onSubmit={handleChatSubmit}>
          <InputGroup className="border-top">
            <InputGroupAddon addonType="prepend">
              <Button
                color="link"
                onClick={onClickFileUpload}
                className="border-right">
                <GrAttachment />
              </Button>

              <input
                ref={fileInput}
                type="file"
                onChange={handleFileUpload}
                multiple={false}
                hidden
              />
            </InputGroupAddon>
            <input
              onChange={handleChatChange}
              value={chatMessage}
              ref={textInput}
              type="text"
              placeholder="Type your message here..."
              className="form-control border-0"
            />
          </InputGroup>
        </Form>
      </Card>
    </div>
  );
};

Chat.propTypes = {
  endAppointment: PropTypes.func,
  user: PropTypes.shape({
    NTOUserID: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    Country: PropTypes.string,
    Email: PropTypes.string,
    AuthID: PropTypes.string,
    isPractitioner: PropTypes.bool,
  }),
  jitsiApi: PropTypes.object,
  appointment: PropTypes.shape({
    organizationEventBookingId: PropTypes.string,
  }),
};

export { Chat };
