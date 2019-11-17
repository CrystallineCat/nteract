import { ChangeEvent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { ConfigOptionEnum, setConfigAtKey } from "../../common/config";
import { PreferencesAppState } from "../setup/state";


export const isEnum = (props: any): props is ConfigOptionEnum =>
  "options" in props;

const makeMapStateToProps =
  (state: PreferencesAppState, { id }: ConfigOptionEnum) => ({
    current: state.config.get(id),
  });

const makeMapDispatchToProps =
  (dispatch: Dispatch, { id }: ConfigOptionEnum) => ({
    makeSetValue: (value: any) => (event: ChangeEvent<HTMLInputElement>) =>
      dispatch(setConfigAtKey(id, value)),
  });

const PureEnumOption = ({
  id,
  label,
  initial,
  options,
  current,
  makeSetValue,
}: ConfigOptionEnum & {current: any, makeSetValue: (value: any) => (event: ChangeEvent<HTMLInputElement>) => void}) => {
  const isChecked = (value: any) => (
    value === current ||
    (initial instanceof Array && current.includes(value))
  );

  const setValue = (value: any) => {
    if (current instanceof Array) {
      if (isChecked(value)) {
        return makeSetValue(current.filter(x => x !== value));
      }
      else {
        return makeSetValue(current.concat([value]));
      }
    }
    else {
      if (isChecked(value)) {
        // do nothing; radio group switched away from us
        return () => undefined;
      }
      else {
        return makeSetValue(value);
      }
    }
  };

  return (
    <section>
      <h1>{label}</h1>
      {options.map(option =>
        <div key={option.value}>
          <label>
            <input
              type={initial instanceof Array ? "checkbox" : "radio"}
              name={id}
              value={option.value}
              checked={isChecked(option.value)}
              onChange={setValue(option.value)}
            />
            &nbsp;
            {option.label}
          </label>
        </div>)}
    </section>
  );
}

export const EnumOption = connect(
  makeMapStateToProps,
  makeMapDispatchToProps,
)(PureEnumOption);

EnumOption.displayName = "EnumOption";
