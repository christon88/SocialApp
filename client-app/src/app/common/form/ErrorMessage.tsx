import React from "react";
import { AxiosResponse } from "axios";
import { Message } from "semantic-ui-react";

interface Props {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<Props> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors)
            .flat()
            .map((error) => (
              <Message.Item>{error}</Message.Item>
            ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default ErrorMessage;
