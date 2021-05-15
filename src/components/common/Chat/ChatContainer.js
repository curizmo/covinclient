import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ChatContainer = (props) => {
  useEffect(() => {
    if (props.chatContainerRef && props.scrollChatToBottom) {
      props.scrollChatToBottom();
    }
  }, []);

  return (
    <div
      className="d-flex flex-column overflow-y-scroll chat-window"
      ref={props.chatContainerRef}>
      {props.children}
    </div>
  );
};

ChatContainer.propsTypes = {
  children: PropTypes.node,
};

export { ChatContainer };
