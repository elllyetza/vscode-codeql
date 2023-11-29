import * as React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SuggestBox as SuggestBoxComponent } from "../../view/common/SuggestBox";
import { AccessPathOption } from "../../model-editor/suggestions";

export default {
  title: "Suggest Box",
  component: SuggestBoxComponent,
} as Meta<typeof SuggestBoxComponent>;

const Template: StoryFn<typeof SuggestBoxComponent> = (args) => (
  <SuggestBoxComponent {...args} />
);

const suggestedOptions: AccessPathOption[] = [
  {
    label: "Argument[self]",
    icon: "symbol-class",
    details: "sqlite3.SQLite3::Database",
    value: "Argument[self]",
  },
  {
    label: "Argument[0]",
    icon: "symbol-parameter",
    details: "name",
    value: "Argument[0]",
    followup: [
      {
        label: "Element[0]",
        icon: "symbol-field",
        value: "Argument[0].Element[0]",
        details: "first character",
      },
      {
        label: "Element[1]",
        icon: "symbol-field",
        value: "Argument[0].Element[1]",
        details: "second character",
      },
      {
        label: "Element[any]",
        icon: "symbol-field",
        value: "Argument[0].Element[any]",
        details: "any character",
      },
    ],
  },
  {
    label: "Argument[1]",
    icon: "symbol-parameter",
    details: "arity",
    value: "Argument[1]",
  },
  {
    label: "Argument[text_rep:]",
    icon: "symbol-parameter",
    details: "text_rep:",
    value: "Argument[text_rep:]",
  },
  {
    label: "Argument[block]",
    icon: "symbol-parameter",
    details: "&block",
    value: "Argument[block]",
    followup: [
      {
        label: "Parameter[0]",
        icon: "symbol-parameter",
        value: "Argument[block].Parameter[0]",
        details: "val",
        followup: [
          {
            label: "Element[:query]",
            icon: "symbol-key",
            value: "Argument[block].Parameter[0].Element[:query]",
          },
          {
            label: "Element[:parameters]",
            icon: "symbol-key",
            value: "Argument[block].Parameter[0].Element[:parameters]",
          },
        ],
      },
      {
        label: "Parameter[1]",
        icon: "symbol-parameter",
        value: "Argument[block].Parameter[1]",
        details: "context",
        followup: [
          {
            label: "Field[@query]",
            icon: "symbol-field",
            value: "Argument[block].Parameter[1].Field[@query]",
          },
        ],
      },
    ],
  },
  {
    label: "ReturnValue",
    icon: "symbol-variable",
    details: undefined,
    value: "ReturnValue",
  },
];

export const SuggestBox = Template.bind({});
SuggestBox.args = {
  options: suggestedOptions,
};
