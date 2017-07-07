import React from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import ObjectInspector from './ObjectInspector';

const renderer = TestUtils.createRenderer();

const defaultProps = {};

describe('ObjectInspector', () => {
  beforeEach(() => {});

  it('should render', () => {
    renderer.render(<ObjectInspector theme="testvalue" />);
    const tree = renderer.getRenderOutput();
    expect(tree.type).toBeA('function');
    expect(tree.props.theme).toEqual('testvalue');
  });

  it('passes `nodeRenderer` prop to <TreeView/>', () => {
    // Test that a custom `nodeRenderer` props is passed to <TreeView/>
    const nodeRenderer = () => null;
    renderer.render(<ObjectInspector nodeRenderer={nodeRenderer} />);
    const tree = renderer.getRenderOutput();

    expect(tree.props.children.type).toBeA('function');
    expect(tree.props.children.props.nodeRenderer).toEqual(nodeRenderer);
  });

  it('passes `handleCollapse` prop to <TreeView/>', () => {
    // Test that a custom `handleExpand` props is passed to <TreeView/>
    const handleCollapse = () => null;
    renderer.render(<ObjectInspector handleCollapse={handleCollapse} />);
    const tree = renderer.getRenderOutput();

    expect(tree.props.children.props.handleCollapse).toEqual(handleCollapse);
  });

  it('passes `handleExpand` prop to <TreeView/>', () => {
    // Test that a custom `handleExpand` props is passed to <TreeView/>
    const handleExpand = () => null;
    renderer.render(<ObjectInspector handleExpand={handleExpand} />);
    const tree = renderer.getRenderOutput();

    expect(tree.props.children.props.handleExpand).toEqual(handleExpand);
  });

  it('passes `onToggle` prop to <TreeView/>', () => {
    // Test that a custom `handleExpand` props is passed to <TreeView/>
    const onToggle = () => null;
    renderer.render(<ObjectInspector onToggle={onToggle} />);
    const tree = renderer.getRenderOutput();

    expect(tree.props.children.props.onToggle).toEqual(onToggle);
  });
});
