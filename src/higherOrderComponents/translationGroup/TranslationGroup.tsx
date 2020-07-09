import React from "react";
import PropType from "prop-types";

interface State {
	process: "init" | "initIn" | "stable" | "stableOut" | "out";
}

interface TranslationNames {
	init: string;
	initIn: string;
	stableOut: string;
	out: string;
}

interface Props {
	name: string | TranslationNames;
	duration?: number;
	delay?: number;
}

class TranslationGroup extends React.Component<Props, State> {
	static propTypes = {
		name: PropType.oneOfType([
			PropType.string,
			PropType.shape({
				init: PropType.string,
				initIn: PropType.string,
				stableOut: PropType.string,
				out: PropType.string,
			}),
		]).isRequired,
		duration: PropType.number,
		delay: PropType.number,
	};
	static defaultProps = {
		delay: 0,
	};
	constructor(props: Props) {
		super(props);
		this.state = {
			process: "init",
		};
	}

	render() {
		const name = this.props.name;
		const Children = this.props.children;
		if (Children) {
			const className = (): string => {
				switch (this.state.process) {
					case "init":
						return typeof name === "string" ? name + "-enter-active" : name.init;
					case "initIn":
						return typeof name === "string"
							? [name + "-enter-active", name + "-enter"].join(" ")
							: [name.init, name.initIn].join(" ");
					case "stable":
						return "";
					case "stableOut":
						return typeof name === "string" ? name + "leave-active" : name.out;
					case "out":
						return typeof name === "string"
							? [name + "-leave-active", name + "-leave-to"].join(" ")
							: [name.stableOut, name.out].join(" ");
				}
			};
			const length = React.Children.count(this.props.children);
			return React.Children.map(this.props.children, (component, index) => {
				if (React.isValidElement(component)) {
					if (!this.props.duration && length === index + 1) {
						return React.cloneElement(component, {
							className: className(),
							onTransitionEnd: this.handleTranslationEnd.bind(this),
						});
					} else {
						return React.cloneElement(component, { className: className() });
					}
				} else {
					return null;
				}
			});
		} else {
			return null;
		}
	}
	handleTranslationEnd() {
		this.setState({
			process: "stable",
		});
	}
	show() {
		if (this.state.process === "init" || this.state.process === "out") {
			this.setState(
				{
					process: "init",
				},
				() => {
					this.setState({
						process: "initIn",
					});
				}
			);
			if (this.props.duration) {
				setTimeout(this.handleTranslationEnd.bind(this), this.props.duration);
			}
		}
	}

	hide() {
		if (this.state.process === "stable") {
			this.setState(
				{
					process: "stableOut",
				},
				() => {
					this.setState({
						process: "out",
					});
				}
			);
			if (this.props.duration) {
				setTimeout(this.handleTranslationEnd.bind(this), this.props.duration);
			}
		}
	}
}

export default TranslationGroup;
