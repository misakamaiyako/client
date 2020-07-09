import React from "react";

import style from "./login.less";
import RingInput from "../../component/ring-input";
import RingButton from "@/component/ring-button";
import { EmailRegexp } from "@/utils/regexp";
import xhr from "@/utils/axios";
import TranslationGroup from "@/higherOrderComponents/translationGroup";

interface State {
	loading: boolean;
	email: string;
	password: string;
	state: "default" | "registered" | "signIn";
	userName: string;
}

export default class Login extends React.Component<any, State> {
	private readonly oldEmailRef: React.RefObject<RingInput>;
	private readonly newEmailRef: React.RefObject<RingInput>;
	private readonly translationGroupRef: React.RefObject<TranslationGroup>;

	constructor(props: any) {
		super(props);
		this.state = {
			loading: false,
			email: "",
			password: "",
			state: "default",
			userName: "",
		};
		this.oldEmailRef = React.createRef();
		this.newEmailRef = React.createRef();
		this.translationGroupRef = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ state: "default" });
		}, 300);
	}

	render() {
		let delay = 0;
		const getDelay = () => (delay += 50);
		console.log(style);
		return (
			<div className={style.root}>
				<div className={style.leftPart} />
				<div className={style.main}>
					<div className={style.defaultInfo}>
						{this.state.state === "default" ? (
							<>
								<div
									className={style.logoPart}
									style={{
										opacity: this.state.state === "default" ? 1 : 0,
									}}>
									<div className={style.logo} />
									<h1>{"欢迎"}</h1>
									<h2>{"输入邮箱开始"}</h2>
								</div>
								<RingInput
									value={this.state.email}
									label={"邮箱地址"}
									placeholder={"user@example.com"}
									ref={this.oldEmailRef}
									className={style.email}
									style={{
										opacity: this.state.state === "default" ? 1 : 0,
									}}
									verification={[
										{
											type: "blur",
											verification: this.emailVerification.bind(this),
										},
									]}
									onChange={value =>
										this.setState({
											email: value,
										})
									}
								/>
							</>
						) : this.state.state === "registered" ? (
							<TranslationGroup
								name={{
									init: style["registered-enter-active"],
									initIn: style["registered-enter"],
									stableOut: style["registered-leave-active"],
									out: style["registered-leave-to"],
								}}
								ref={this.translationGroupRef}>
								<div style={{ transitionDelay: getDelay() + "ms" }}>
									<RingInput
										value={this.state.email}
										label={"邮箱地址"}
										placeholder={"user@example.com"}
										ref={this.newEmailRef}
										className={style.email}
										verification={[
											{
												type: "blur",
												verification: this.emailVerification.bind(this),
											},
										]}
										onChange={value =>
											this.setState({
												email: value,
											})
										}
									/>
								</div>
								<div style={{ transitionDelay: getDelay() + "ms" }}>
									<RingInput
										value={this.state.userName}
										label={"用户名"}
										placeholder={"请输入用户名"}
										className={style.email}
										verification={[
											{
												type: "blur",
												verification: this.userNameVerification.bind(this),
											},
										]}
										onChange={value =>
											this.setState({
												userName: value,
											})
										}
									/>
								</div>
								<div style={{ transitionDelay: getDelay() + "ms" }}>
									<RingInput
										value={this.state.password}
										label={"密码"}
										placeholder={"请输入密码"}
										className={style.email}
										type={"password"}
										verification={[
											{
												type: "blur",
												verification: this.passwordVerification.bind(this),
											},
										]}
										onChange={value =>
											this.setState({
												password: value,
											})
										}
									/>
								</div>
							</TranslationGroup>
						) : null}
						<div className={[style.buttonBox, this.state.state === "registered" ? style.flap : null].join(" ")}>
							<RingButton
								className={style.button}
								type="primary"
								onClick={this.check.bind(this)}
								loading={this.state.loading}>
								{this.state.state === "default" ? "开始" : "登录"}
							</RingButton>
							<RingButton
								className={style.button}
								type="primary"
								onClick={this.registered.bind(this)}
								loading={this.state.loading}>
								{"注册"}
							</RingButton>
						</div>
					</div>
				</div>
			</div>
		);
	}

	emailVerification(email: string, callback: (Error?: Error) => void) {
		if (!EmailRegexp.test(email)) {
			callback(new Error("请输入正确的邮箱地址"));
		} else {
			callback();
		}
	}

	userNameVerification(name: string, callback: (Error?: Error) => void) {
		if (name.length < 3) {
			callback(new Error("用户名长度不得低于3位"));
		} else {
			callback();
		}
	}

	passwordVerification(name: string, callback: (Error?: Error) => void) {
		if (name.length < 6) {
			callback(new Error("密码长度不能低于6位"));
		} else {
			callback();
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
					url: "/user/user",
					params: {
						email: this.state.email,
					},
				}).then(({ data }) => {
					if (data.count === 0) {
						this.setState(
							{
								loading: false,
								state: "registered",
							},
							() => {
								this.translationGroupRef.current?.show();
							}
						);
					} else {
						this.setState({
							loading: false,
							state: "signIn",
						});
					}
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
				});
			});
	}

	registered() {
		let verifiers: Promise<void[]>[] = (this.translationGroupRef.current?.props
			.children as React.ReactElement[]).map(t => (t.props.children as RingInput).verification());
		Promise.all(verifiers).then(() => {
			this.setState({
				loading: true,
			});
			xhr({
				url: "/registered",
				data: {
					name: this.state.userName,
					email: this.state.email,
					password: this.state.password,
				},
				method: "post",
			})
				.then(() => {
					alert("验证邮件已发送到您的邮箱，请前往你的邮箱确认。");
					this.setState({
						loading: false,
					});
				})
				.catch(res => {
					alert(res);
				});
		});
	}
}
