import { mkdirpObservable, writeFileObservable } from "fs-observable";
import { RecordOf } from "immutable";
import * as path from "path";
import { Reducer } from "redux";
import { combineEpics, ofType, StateObservable } from "redux-observable";
import { mapTo, switchMap } from "rxjs/operators";
import { Configuration, ConfigurationState } from "../schema";

import { CONFIG_FILE_PATH } from "../paths";


export interface SetConfigAction<T> {
  type: "SET_CONFIG_AT_KEY";
  payload: { key: string; value: T };
}

export const setConfigAtKey =
  <T>(key: string, value: T): SetConfigAction<T> => ({
    type: "SET_CONFIG_AT_KEY",
    payload: { key, value },
  });

export const setConfigReducer:
  Reducer<RecordOf<Configuration>, SetConfigAction<any>> =
  (state, action) =>
    state!.set(action.payload.key, action.payload.value);

export const saveConfigEpic = combineEpics(
  (action$, state$: StateObservable<ConfigurationState>) =>
    action$.pipe(
      ofType("SET_CONFIG_AT_KEY"),
      switchMap(
        () => mkdirpObservable(path.dirname(CONFIG_FILE_PATH)),
      ),
      switchMap(() =>
        writeFileObservable(
          CONFIG_FILE_PATH,
          JSON.stringify(state$.value.config.toJS())
        ).pipe(
          mapTo({ type: "CONFIG_SAVED" }),
        )
      ),
    ),
);
