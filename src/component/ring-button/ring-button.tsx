import React, { MouseEventHandler } from 'react';
import PropType from 'prop-types';

import ringButton from './ring-button.less';

interface Props {
	type?: 'primary';
	loading?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	style?: React.StyleHTMLAttributes<any>;
	className?:React.ClassAttributes<any>
}
export default class RingButton extends React.Component<Props, Object> {
	static propTypes = {
		type: PropType.string,
		loading: PropType.bool,
		onClick: PropType.func,
		disabled: PropType.bool,
	};
	static defaultProps = {
		type: 'default',
		loading: false,
	};
	render() {
		return (
			<button
				className={[
					ringButton.button,
					this.props.className,
					this.props.type === 'primary' ? ringButton.primary : null,
					this.props.loading ? ringButton.loaderAdded : null,
				].join(' ')}
				onClick={this.handleClick.bind(this)}
				style={this.props.style}
			>
				{this.props.loading ? (
					<div className={ringButton.loaderBackground} />
				) : null}
				<span>{this.props.children}</span>
			</button>
		);
	}
	handleClick(event:React.MouseEvent<HTMLButtonElement, MouseEvent>):void{
		if (this.props.loading===false&&this.props.onClick){
			this.props.onClick(event)
		}
	}
}
