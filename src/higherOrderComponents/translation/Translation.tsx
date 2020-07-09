import React, { ReactElement } from "react";
import PropType from "prop-types";

interface State {
	process: "init" | "init-in" | "stable" | "stable-out" | "out";
}

interface TranslationNames {
	init: string;
	initIn: string;
	stableOut: string;
	out: string;
}

interface Props {
	name: string | TranslationNames;
	duration: number;
}

class Translation extends React.Component<Props, State> {
	static propTypes = {
		name: PropType.oneOfType([PropType.string, PropType.arrayOf(PropType.string)]).isRequired,
		duration: PropType.number.isRequired,
	};

	constructor(props: any) {
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
					case "init-in":
						return typeof name === "string"
							? [name + "-enter-active", name + "-enter"].join(" ")
							: [name.init, name.initIn].join(" ");
					case "stable":
						return "";
					case "stable-out":
						return typeof name === "string" ? name + "leave-to" : name.out;
					case "out":
						return typeof name === "string"
							? [name + "-leave-active", name + "-leave-to"].join(" ")
							: [name.stableOut, name.out].join(" ");
				}
			};
			// @ts-ignore
			return React.cloneElement(this.props.children, {
				className: className(),
			});
		} else {
			return null;
		}
	}

	show() {
		if (this.state.process.indexOf("init") === -1) {
			this.setState(
				{
					process: "init",
				},
				() => {
					this.setState({
						process: "init-in",
					});
				}
			);
			setTimeout(() => {
				this.setState({
					process: "stable",
				});
			}, this.props.duration);
		}
	}

	hide() {
		if (this.state.process === "stable") {
			this.setState(
				{
					process: "stable-out",
				},
				() => {
					this.setState({
						process: "out",
					});
				}
			);
			setTimeout(() => {
				this.setState({
					process: "stable",
				});
			}, this.props.duration);
		}
	}
}

export default Translation;
