import React from 'react';

import style from './login.less';
import RingInput from '../../component/ring-input';
import RingButton from '@/component/ring-button';
import { EmailRegexp } from '@/utils/regexp';
import xhr from '@/utils/axios';
interface State {
	emailState: 'init' | 'default' | 'registered' | 'signIn';
	loading: boolean;
	email: string;
	password: string;
	actionState: 'default' | 'registered' | 'signIn';
}
export default class Login extends React.Component<any, State> {
	private readonly oldEmailRef: React.RefObject<RingInput>;
	constructor(props: any) {
		super(props);
		this.state = {
			emailState: 'init',
			loading: false,
			email: '',
			password: '',
			actionState: 'default',
		};
		this.oldEmailRef = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ emailState: 'default' });
		}, 300);
	}
	render() {
		return (
			<div className={style.root}>
				<div className={style.leftPart} />
				<div className={style.main}>
					<div className={style.defaultInfo}>
						{this.state.actionState === 'default' ? (
							<div
								className={style.logoPart}
								style={{ opacity: this.state.emailState === 'default' ? 1 : 0 }}
							>
								<div className={style.logo} />
								<h1>{'欢迎'}</h1>
								<h2>{'输入邮箱开始'}</h2>
							</div>
						) : null}
						<RingInput
							value={this.state.email}
							label={'邮箱地址'}
							placeholder={'user@example.com'}
							ref={this.oldEmailRef}
							className={style.email}
							verification={[
								{
									type: 'blur',
									verification: this.emailVerification.bind(this),
								},
							]}
							onChange={value =>
								this.setState({
									email: value,
								})
							}
						/>
						<RingButton
							className={style.button}
							type="primary"
							onClick={this.check.bind(this)}
							loading={this.state.loading}
						>
							{'开始'}
						</RingButton>
					</div>
				</div>
			</div>
		);
	}
	emailVerification(email: string, callback: (Error?: Error) => void) {
		if (!EmailRegexp.test(email)) {
			callback(new Error('请输入正确的邮箱地址'));
		}
	}
	check() {
		this.setState({
			loading: true,
		});
		this.oldEmailRef.current
			?.verification()
			.then(() => {
				xhr({
					url: '/user/user',
					params: {
						email: this.state.email,
					},
				}).then(({ data }) => {
					if (data.count === 0) {
					} else {
					}
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
				});
			});
	}
}
