import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label, Select } from "semantic-ui-react";

interface Props extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const SelectInput: React.FC<Props> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} widht={width}>
      <Select
        value={input.value}
        onChange={(_, data) => input.onChange(data.value)}
        options={options}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default SelectInput;
