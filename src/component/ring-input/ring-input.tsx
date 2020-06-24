import React, { ChangeEvent } from 'react';
import PropType from 'prop-types';

import ringInput from './ring-input.less';
interface Props {
	value?: number | string;
	label?: string;
	placeholder?: string;
	verification?: {
		type: string;
		verification: (value: any, callback: () => void) => void;
	}[];
	type?: 'text' | 'password';
	onChange?: (value: any) => void;
	style?: React.StyleHTMLAttributes<any>;
	className?:React.ClassAttributes<any>
}
interface State {
	error: boolean;
	errorText: string;
	verifying: boolean;
}
export default class RingInput extends React.Component<Props, State> {
	static propTypes = {
		value: PropType.string,
		label: PropType.string,
		placeholder: PropType.string,
		verification: PropType.array,
		type: PropType.string,
		onChange: PropType.func,
		style: PropType.object,
	};
	static defaultProps = {
		label: '',
		placeholder: '',
		type: 'text',
		value: '',
	};
	state = {
		error: false,
		errorText: '',
		verifying: false,
	};
	render() {
		return (
			<div
				className={[
					ringInput.ringInputBox,
					this.props.className,
					this.state.error ? ringInput.error : null,
				].join(' ')}
				style={{width: 300,...this.props.style}}
			>
				<input
					type={this.props.type}
					value={this.props.value}
					className={ringInput.input}
					placeholder={this.props.placeholder}
					onChange={this.handleInput.bind(this)}
					onBlur={this.blur.bind(this)}
				/>
				<label className={ringInput.label}>{this.props.label}</label>
				<div className={ringInput.underLine} />
				<div className={ringInput.focusUnderLine} />
				<div className={ringInput.errorUnderLine} />
				<div className={ringInput.errorText}>{this.state.errorText}</div>
			</div>
		);
	}
	handleInput(e: ChangeEvent<HTMLInputElement>) {
		const value = e.currentTarget.value;
		this.props.onChange && this.props.onChange(value);
		if (this.props.verification) {
			const rule = this.props.verification.find(t => t.type === 'change');
			if (rule) {
				this.verificationOne(this.props.value, rule.verification);
			}
		}
	}
	blur() {
		if (this.props.value && this.props.verification) {
			const rule = this.props.verification.find(t => t.type === 'blur');
			if (rule) {
				this.verificationOne(this.props.value, rule.verification);
			}
		}
	}
	verificationOne(value: any, verification: Function): Promise<void> {
		this.setState({
			verifying: true,
		});
		return new Promise((resolve, reject) => {
			verification(value, (error?: Error) => {
				if (error) {
					this.setState({
						error: true,
						errorText: error.message,
						verifying: false,
					});
					reject();
				} else {
					this.setState({
						error: false,
						errorText: '',
						verifying: false,
					});
					resolve();
				}
			});
		});
	}
	verification(): Promise<void[]> {
		this.setState({ error: false, errorText: '', verifying: true });
		let worker: Promise<void>[] = [];
		this.props.verification?.forEach(t => {
			worker.push(this.verificationOne(this.props.value, t.verification));
		});
		return Promise.all(worker);
	}
}
