import React, { FC } from "react";
import {
	Container,
	Sidebar,
	Main,
	SidebarProfile,
	SidebarProfileContainer,
	Heading
} from "./styles";
import { Navbar, Button, Input } from "../../components";
import {useAuth} from "../../custom-hooks";

interface ComponentProp {
	path: string;
}

const Profile: FC<ComponentProp> = () => {
	const { user, send_email_verfication, send_password_reset_mail } = useAuth()

	const handleVerification = () => {
		send_password_reset_mail(user.email)
	}

	return (
		<>
			<Navbar />
			<Container>
				<Sidebar>
					<SidebarProfileContainer>
						<SidebarProfile
							style={{
								background:
									'url("https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&w=300")',
								backgroundSize: "cover",
								backgroundPosition: "bottom",
							}}
						/>
					</SidebarProfileContainer>
					<div>
						<Heading>test333</Heading>
						<Heading>test333@gmail.com</Heading>
						<div>
							<Button type="button" primary>
								Edit
							</Button>
							<Button type="button" onClick={handleVerification}>Verify Email</Button>
						</div>
					</div>
				</Sidebar>
				<Main>
					<div>
						<div>Overview</div>
						<div>Setting</div>
					</div>
					<h1>History</h1>
					<div
						style={{
							width: "100%",
							height: "500px",
							background: "red",
						}}
					></div>
				</Main>
			</Container>
		</>
	);
};

export default Profile;
