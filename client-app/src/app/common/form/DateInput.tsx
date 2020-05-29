import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormFieldProps, Form, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";

interface Props extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}

const DateInput: React.FC<Props> = ({
  input,
  width,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} widht={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        parse={"dd mm yy"}
        messages={{ dateButton: "date", timeButton: "time" }}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
