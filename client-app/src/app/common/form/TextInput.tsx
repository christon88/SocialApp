import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";

interface Props extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextInput: React.FC<Props> = ({
  input,
  width,
  type,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} type={type} widht={width}>
      <input {...input} placeholder={placeholder} type="text" />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextInput;
