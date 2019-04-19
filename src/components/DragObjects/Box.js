import React, {Component} from 'react';
import { DragSource, ConnectDragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
require('./DragObjects.css');

const boxSource = {
	beginDrag(props) {
		const { id, left, top } = props;
		// console.log('Boxes for state value  beingDrag ',props)
		return { id, left, top };
	},
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}


class Box extends Component{

	render(){
		const {
						id,
						hideSourceOnDrag,
						left,
						top,
						isResizeAllowed,
						className,
						isMaximized,
						isAlwaysOnTop,
						isBringToFront,
						connectDragSource,
						isDragging,
						children,
					} = this.props;
			let newClassName = className;
			let style = {
											position: 'absolute',
											border: '1px solid rgba(0, 0, 0, 0.30)',
											// backgroundColor: 'white',
											// padding: '0.5rem 1rem',
											cursor: 'move',
											// resize: 'both',
											// overflow: 'auto',
										};
		if (isDragging && hideSourceOnDrag) {
			return null
		}

		if (isResizeAllowed){
			style = { ...style, resize: 'both', overflow: 'auto' };
		}

		if (isMaximized) {
			newClassName +=  " dnd-maximized"
		}

		if (isAlwaysOnTop) {
			newClassName +=  " dnd-always-on-top"
		}

		if (isBringToFront) {
			newClassName +=  " dnd-bring-to-front"
		}

		// console.log('value of resize ...',isResizeAllowed,style)

		return connectDragSource(
			<div id={"dndBox" + id} className={"dnd-box-overlay " + newClassName } style={{ ...style, left, top }}>{children}</div>,
		)
	}

}

export default DragSource(ItemTypes.BOX, boxSource, collect)(Box);
