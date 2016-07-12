import React, { Component, PropTypes } from 'react'
import ObjectName from '../object/ObjectName'
import ObjectValue from '../object/ObjectValue'

const Colon = () => <span>: </span>

/**
 * if isNonenumerable is specified, render the name dimmed
 */
const ObjectLabel = ({ name, data, isNonenumerable }) => {
  const object = data

  return (
    <span>
      <ObjectName name={name} dimmed={isNonenumerable} />
      <Colon />
      <ObjectValue object={object} />
    </span>
  )
}

ObjectLabel.propTypes = {
  /** Non enumerable object property will be dimmed */
  isNonenumerable: PropTypes.bool,
}

ObjectLabel.defaultProps = {
  isNonenumerable: false,
}

export default ObjectLabel
