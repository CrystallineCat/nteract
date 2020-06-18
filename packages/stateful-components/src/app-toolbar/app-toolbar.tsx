import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { actions, selectors, ContentRef } from "@nteract/core";
import { AppState } from "@nteract/types";
import { isSidebarVisible } from "@nteract/selectors";

export interface DispatchProps {
  addCell: () => void;
  restartAndRun: () => void;
  interrupt: () => void;
  clearOutputs: () => void;
  toggleSidebar: () => void;
}

export interface ComponentProps {
  id: string;
  children: React.ReactNode | JSX.Element;
  contentRef: ContentRef;
  isSidebarVisible?: boolean;
}

export type AppToolbarProps = DispatchProps & ComponentProps;

export const AppToolbarContext = React.createContext({});

class AppToolbar extends React.Component<AppToolbarProps> {
  render() {
    return (
      <AppToolbarContext.Provider value={this.props}>
        {this.props.children}
      </AppToolbarContext.Provider>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: ComponentProps
): DispatchProps => {
  const { id, children, contentRef } = ownProps;

  return {
    toggleSidebar: () => dispatch(actions.toggleSidebar()),
    clearOutputs: () => dispatch(actions.clearAllOutputs({ contentRef })),
    addCell: () => {
      dispatch(
        actions.createCellBelow.with({ cellType: "code", source: "" })({
          contentRef,
        })
      );
    },
    restartAndRun: () => dispatch(actions.executeAllCells({ contentRef })),
    interrupt: () => {
      dispatch(actions.interruptKernel({ contentRef }));
    },
  };
};

const mapStateToProps = (state: AppState) => ({
  isSidebarVisible: state.core.entities.sidebar.isSidebarVisible,
});

export default connect(mapStateToProps, mapDispatchToProps)(AppToolbar);
