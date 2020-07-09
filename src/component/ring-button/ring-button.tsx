import React, { CSSProperties, MouseEventHandler } from "react";
import PropType from "prop-types";

import CommonProps from "@/utils/commonProps";
import ringButton from "./ring-button.less";

interface Props extends CommonProps {
	type?: "primary";
	loading?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
}
export default class RingButton extends React.Component<Props, Object> {
	static propTypes = {
		type: PropType.string,
		loading: PropType.bool,
		onClick: PropType.func,
		disabled: PropType.bool,
		style: PropType.any,
	};
	static defaultProps = {
		type: "default",
		loading: false,
	};
	render() {
		return (
			<button
				className={[
					ringButton.button,
					this.props.className,
					this.props.type === "primary" ? ringButton.primary : null,
					this.props.loading ? ringButton.loaderAdded : null,
				].join(" ")}
				onClick={this.handleClick.bind(this)}
				style={this.props.style}>
				{this.props.loading ? <div className={ringButton.loaderBackground} /> : null}
				<span>{this.props.children}</span>
			</button>
		);
	}
	handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
		if (this.props.loading === false && this.props.onClick) {
			this.props.onClick(event);
		}
	}
}
