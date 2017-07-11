import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

import { DEFAULT_ROOT_PATH, hasChildNodes, getExpandedPaths } from './pathUtils';

class ConnectedTreeNode extends Component {

  shouldComponentUpdate(nextProps) {
    let keys = Object.keys(nextProps.expandedPaths);

    if (this.props.shouldComponentUpdate && this.props.shouldComponentUpdate(this.props, nextProps))
      return true;

    if (keys.length !== Object.keys(this.props.expandedPaths).length)
      return true;

    for (let key of keys) {
      if (!!nextProps[key] !== !!this.props.expandedPaths[key])
        return true;
    }
    return nextProps.data !== this.props.data || nextProps.name !== this.props.name;
  }

  /**
   * React lifecycle method to determine if this component has changed dimensions
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    const previouslyExpandedPaths = prevProps.expandedPaths;
    const previouslyExpanded = !!previouslyExpandedPaths[prevProps.path];
    const { expandedPaths } = this.props;
    const expanded = !!expandedPaths[this.props.path];
    // we changed dimensions
    if (expanded !== previouslyExpanded) {
      if (this.props.onToggle)
        this.props.onToggle();
    }
  }

  handleClick(path) {
    const { expandedPaths } = this.props;
    const expanded = !!expandedPaths[path];

    // We're in a current expanded state and the user just clicked to collapse us
    if (expanded && this.props.handleCollapse) {
      this.props.handleCollapse(path);
    }
    // We're in a current collapsed stated and the user just clicked to expand us
    else if (!expanded && this.props.handleExpand) {
      this.props.handleExpand(path);
    }

  }

  renderChildNodes(parentData, parentPath) {
    const { dataIterator } = this.props;
    const { depth } = this.props;

    const { nodeRenderer, onToggle, handleCollapse, handleExpand, expandedPaths, extraStuff } = this.props;

    let childNodes = [];
    for (let { name, data, ...props } of dataIterator(parentData)) {
      const key = name;
      const path = `${parentPath}.${key}`;
      childNodes.push(
        <ConnectedTreeNode
          name={name}
          data={data}
          depth={depth + 1}
          path={path}
          key={key}
          dataIterator={dataIterator}
          nodeRenderer={nodeRenderer}
          expandedPaths={expandedPaths}
          // This should pass down the prop received from the object inspector
          onToggle={onToggle}
          handleCollapse={handleCollapse}
          handleExpand={handleExpand}
          // Because we can't pass down the rest of ...this.props without causing an infinite loop
          extraStuff={extraStuff}

          {...props} // props for nodeRenderer
        />,
      );
    }
    return childNodes;
  }

  render() {
    const { data, dataIterator, path, depth, expandedPaths } = this.props;

    const nodeHasChildNodes = hasChildNodes(data, dataIterator);
    const expanded = !!expandedPaths[path];

    const { nodeRenderer } = this.props;

    return (
      <TreeNode
        expanded={expanded}
        onClick={nodeHasChildNodes ? this.handleClick.bind(this, path) : () => {}}
        // show arrow anyway even if not expanded and not rendering children
        shouldShowArrow={nodeHasChildNodes}
        // show placeholder only for non root nodes
        shouldShowPlaceholder={depth > 0}
        // Render a node from name and data (or possibly other props like isNonenumerable)
        nodeRenderer={nodeRenderer}

        {...this.props}
      >
        {// only render if the node is expanded
        expanded ? this.renderChildNodes(data, path) : undefined}
      </TreeNode>
    );
  }
}

ConnectedTreeNode.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,

  depth: PropTypes.number,
  expanded: PropTypes.bool,

  nodeRenderer: PropTypes.func,
};

class TreeView extends Component {
  static defaultProps = {
    expandLevel: 0,
    expandPaths: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      expandedPaths: getExpandedPaths(
        props.data,
        props.dataIterator,
        props.expandPaths,
        props.expandLevel
      )
    };
  }


  render() {
    const {
      name,
      data,
      dataIterator,
      expandPaths,
      expandLevel,
      nodeRenderer,
      handleExpand,
      handleCollapse,
      onToggle } = this.props;

    let expandedPaths = getExpandedPaths(data, dataIterator, expandPaths, expandLevel);

    const rootPath = DEFAULT_ROOT_PATH;

    return (
      <ConnectedTreeNode
        name={name}
        data={data}
        dataIterator={dataIterator}
        depth={0}
        path={rootPath}
        expandedPaths={expandedPaths}
        nodeRenderer={nodeRenderer}
        handleExpand={handleExpand}
        handleCollapse={handleCollapse}
        onToggle={onToggle}
        {...this.props}
      />
    );
  }
}

TreeView.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  dataIterator: PropTypes.func,

  nodeRenderer: PropTypes.func,

  handleExpand: PropTypes.func,
  handleCollapse: PropTypes.func,
  onToggle: PropTypes.func
};

TreeView.defaultProps = {
  name: undefined,
};

export default TreeView;
