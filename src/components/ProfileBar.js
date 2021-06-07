import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Illustrations } from "../assets";
import UserContext from "../UserContext.js";
import Modal from "../Modal";
import { FiEdit2 } from "react-icons/fi";
import firebase from "firebase/app";
import { navigate } from "@reach/router";

const Container = styled.div`
    position: relative;
    width: 100%
    height: 100vh;
    background-color: blue;
    z-index: 6;
`;

const CloseWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100vh;
    background-color: #0000009e;
`;

const Wrapper = styled.div`
    width: 25%;
    min-width: 300px;
    height: 100vh;
    position: absolute;
    z-index: 6;
    top: 0;
    right: 0;
    bottom: auto;
    background-color: #fff;
    overflow-y: scroll;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);

    @media (max-width: 500px) {
        width: 100%;
        height: 80%;
        position: fixed;
        bottom: 0;
        border-radius: 40px 40px 0px 0px;
        top: auto;
        right: 0;
    }
`;

const ProfilePicWrapper = styled.div`
    width: 100%;
    height: auto;
    display: grid;
    padding: 3em;
    place-items: center;
    background-color: #d7d7d7;
`;

const ProfilePic = styled.img`
    border-radius: 50%;
    width: 150px;
    height: auto;
    box-shadow: 0px 0px 23px 20px rgb(188 188 188);
`;

const UserInfoWrapper = styled.div`
    padding: 1em;
    height: 100%;
    border-top: 1px solid #a7a7a7;   
    position: relative;
`;

const Button = styled.a`
    padding: 1em 0.5em;
    text-align: center;
    background-color: #000;
    border-radius: 10px;
    border: none;
    color: #fff;
    display: block;
    font-weight: bold;
    cursor: pointer;
    position: sticky;
    top: 0;
    margin: 1em auto;
    font-family: "Montserrat", sans-serif;

    &:disabled {
        background-color: grey;
        color: black;
    }
`;

const Btn = styled.button`
    padding: 1em 0.5em;
    text-align: center;
    background-color: #000;
    border-radius: 10px;
    border: none;
    color: #fff;
    display: block;
    font-weight: bold;
    cursor: pointer;
    position: sticky;
    top: 0;
    margin: 1em auto;
    font-family: "Montserrat", sans-serif;

    &:disabled {
        background-color: grey;
        color: black;
    }
`;

const IconWrapper = styled.div`
    width: 2em;
    height: 2em;
    position: absolute;
    top: 10px;
    right: 5px;
    display: grid;
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 0px 8px 2px rgb(188 188 188);
    place-items: center;

    @media (max-width: 500px) {
        height: 3em;
        width: 3em;
        top: 15px;
        right: 10px;
    }

    &:hover {
        background: #eee;
    }
`;

const Portal = styled.div`
    padding: 1em;
    background-color: #fff;
    border-radius: 10px;
    z-index: 1;
    width: 40%;
    box-shadow: 0 4px 23px 5px rgb(0 0 0 / 20%), 0 2px 6px rgb(0 0 0 / 15%);

    @media (max-width: 500px) {
        width: 90%;    
    }
`;

const Input = styled.input`
    width: 100%;
    border-radius: 3px;
    display: block;
    padding: 0.5em 0em;
    color: black;
    background: transparent;
    border: none;
    font-size: larger;
    outline: none;

    &:hover {
        outline: none;
    }
`;

const Heading = styled.div`
    padding: 1em 0em;
    position: relative;
    font-weight: bold;

    &:hover:after {
        content: " Double Click to edit";
        background-color: #000;
        color: #fff;
        position: absolute;
        padding: 0.2em 0.5em;
        border-radius: 40px;
        font-size: 12px;
        margin-left: 0.4em;
    }
`;

const MySelect = styled.select`
    
    &:disabled {
        border: none;
        background: transparent;
    }

`

const ModalWrapper = styled.div`
    height: 70vh;
    width: 100%;
    position: relative;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 10px;
`

const ImageForm = styled.form`
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 2em 0em;
`

const Canvas = styled.canvas`
    width: 100%;
    height: auto;
    border: 1px dotted #c8c8c8;
`

const ProfileBar = ({ showProfile, setShowProfile }) => {
    const user = useContext(UserContext);
    const [userInfo, setUserInfo] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [busNumber, setBusNumber] = useState("");
    const [userType, setUserType] = useState("");
    const [showProfileEdit, setShowProfileEdit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDisplayNameEdit, setShowDisplayNameEdit] = useState(true);
    const [showEmailEdit, setShowEmailEdit] = useState(false);
    const [showPhoneEdit, setShowPhoneEdit] = useState(false);
    const [showBusNumberEdit, setShowBusNumberEdit] = useState(false);
    const [showTypeEdit, setShowTypeEdit] = useState(true);
    const [showUploadBtn, setShowUploadBtn] = useState(true);

    const _onMouseOver = () => {
        setShowProfileEdit(true);
    };

    const _onMouseLeave = () => {
        setShowProfileEdit(false);
    };

    const sendEmailVerfication = async () => {
        try {
            const user = await firebase.auth().currentUser
            const isSend = await user.sendEmailVerification()
            console.log("Email sent from here !")
        } catch (e) {
            console.log("Error While sending the email Verfication link", e)
        }
    }

    const handleDisplayNameChange = (e) => {
        if (e.key === "Enter") {
            user.updateProfile({
                displayName: displayName,
            }).then(() => {
                console.log("Update Successfully !");
            }, console.eror);
        } else {
            return;
        }
    };
    const renderToCanvas = e => {
        console.log("The image Event: ", e);

        let uploadForm = document.getElementById("uploadForm")
        let pass = uploadForm.checkValidity()
        setShowUploadBtn(!pass)

        let file = e.target.files[0];
        let canvas = document.getElementById("c")
        let canvasCtx = canvas.getContext("2d")

        // create Image
        createImageBitmap(file).then(bitmap => {
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            canvasCtx.drawImage(bitmap, 0, 0);
        }).catch(e => {
            console.log("Error Occured while inserting Image in Canvas ", e);
        });
    }

    const handleEmailChange = (e) => {
        if (e.key === "Enter") {
            user.updateEmail(email).then(() => {
                console.log("Update Successfully !");
            }, console.eror);
        } else {
            return;
        }
    };

    const handleTypeChange = (e) => {
        console.log("Mouse on Leave is Working !")
        firebase.firestore().collection("accounts").doc(user.uid).update({
            type: e.target.value
        }).then(() => {
            console.log("Updated Successfully !")
            if (userInfo.type !== userType) {
                window.location.replace("/")
            }
        }, console.error)
    }

    const handleBusNumberChange = (e) => {
        if (e.key === "Enter") {
            firebase.firestore().collection("accounts").doc(user.uid).update({
                busNo: e.target.value
            }).then(() => {
                console.log("Updated Successfully !")
            }, console.error)
        } else {
            return
        }
    }

    const handlePhoneChange = (e) => {
        if (e.key === "Enter") {
            firebase.firestore().collection("accounts").doc(user.uid).update({
                phone: e.target.value
            }).then(() => {
                console.log("Updated Successfully !")
            }, console.error)
        } else {
            return
        }
    }

    const _becomeAContributer = () => {
        console.log("Become a Contributer");

        let actionCodeSettings = {
            url: "http://www.jaidev.me",
            handleCodeInApp: true
        }

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
            console.log("Done")
        }, console.error)
        /*user.updateProfile({
            ya: "Red"
        }).then((r) => {
            console.log("Update Profile ", r)
        }, console.error) */
    };

    const handleSignOut = () => {
        firebase.auth().signOut().then(() => {
            navigate("/")
        }, console.error)
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        let file = e.target[0].files[0];
        console.log(file);

        try {
            let storageResult = await firebase.storage().ref(`profile/${user.uid}/${file.name}`).put(file)
            let url = await storageResult.ref.getDownloadURL()
            if (url) {
                let User = await firebase.auth().currentUser
                let result = await User.updateProfile({
                    photoURL: url
                })
                console.log("Profile Pic is Updated", user)
            }
        } catch (e) {
            console.log("Error Occured While upload the image ", e)
        }
    }

    useEffect(() => {
        if (user) {
            setDisplayName((user.displayName === null) ? "Not Set" : user.displayName);
            setEmail(user.email);
            setPhone(user.phone || "Not Set");

            const User = firebase.auth().currentUser
            console.log(User)

            firebase
                .firestore()
                .collection("accounts")
                .where("uid", "==", user.uid)
                .onSnapshot((snap) => {
                    snap.docChanges().forEach((d) => {
                        setUserInfo(d.doc.data());
                        setUserType(d.doc.data().type)
                        setBusNumber(d.doc.data().busNo)
                        setPhone(d.doc.data().phone)
                    });
                });
        } else {
            return
        }
    }, []);

    return (
        <Container>
            {showProfile ? (
                <>
                    <Wrapper>
                        <ProfilePicWrapper
                            onMouseOver={_onMouseOver}
                            onMouseLeave={_onMouseLeave}
                        >
                            {showProfileEdit ? (
                                <IconWrapper>
                                    <FiEdit2
                                        onClick={() => setShowModal(true)}
                                    />
                                </IconWrapper>
                            ) : (
                                ""
                            )}
                            <ProfilePic
                                src={user.photoURL || "https://firebasestorage.googleapis.com/v0/b/chat-294407.appspot.com/o/events%2Fprofile.jpg?alt=media&token=84fe27e6-82e7-4599-baca-d1cd92cb9a57"}
                                style={{ borderRadius: "50%" }}
                            />
                        </ProfilePicWrapper>
                        <UserInfoWrapper>
                            <h2
                                style={{
                                    textAlign: "center",
                                    marginBottom: "2em",
                                }}
                            >
                                User Info
                            </h2>
                            <div
                                onDoubleClick={() =>
                                    setShowDisplayNameEdit(false)
                                }
                                onMouseLeave={() =>
                                    setShowDisplayNameEdit(true)
                                }
                            >
                                <Heading htmlFor="">Display Name</Heading>
                                <Input
                                    type="text"
                                    value={displayName}
                                    placeholder="Name is not Set"
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                    readOnly={showDisplayNameEdit}
                                    onKeyDown={handleDisplayNameChange}
                                />
                            </div>
                            <hr />
                            <div
                                onDoubleClick={() => setShowEmailEdit(false)}
                                onMouseLeave={() => setShowEmailEdit(true)}
                            >
                                <Heading>Email Address</Heading>
                                <Input
                                    type="text"
                                    value={email}
                                    placeholder="Name is not Set"
                                    onChange={(e) => setEmail(e.target.value)}
                                    readOnly={showEmailEdit}
                                    onKeyDown={handleEmailChange}
                                />
                            </div>
                            <hr />
                            <div style={{ position: "relative" }}>
                                <Heading>Bio</Heading>
                                <p style={{ wordBreak: "break-all" }}>
                                    Hi, I am User ...
                                </p>
                            </div>
                            <hr />
                            <div
                                onDoubleClick={() =>
                                    setShowTypeEdit(false)
                                }
                                onMouseLeave={() =>
                                    setShowTypeEdit(true)
                                }
                            >
                                <Heading>Type</Heading>
                                <MySelect
                                    style={{ display: "block" }}
                                    onChange={(e) => {
                                        setUserType(e.target.value)
                                    }}
                                    value={userType}
                                    disabled={showTypeEdit}
                                    onMouseLeave={handleTypeChange}
                                >
                                    <option value="driver">Driver</option>
                                    <option value="conductor">Conductor</option>
                                    <option value="user">User</option>
                                </MySelect>
                            </div>
                            <hr />
                            <div
                                onDoubleClick={() => setShowPhoneEdit(false)}
                                onMouseLeave={() => setShowPhoneEdit(true)}
                            >
                                <Heading>Phone</Heading>
                                <Input
                                    type="text"
                                    value={phone}
                                    placeholder="Name is not Set"
                                    onChange={(e) => setPhone(e.target.value)}
                                    readOnly={showPhoneEdit}
                                    onKeyDown={handlePhoneChange}
                                />
                            </div>
                            <hr />
                            <div
                                onDoubleClick={() => setShowBusNumberEdit(false)}
                                onMouseLeave={() => setShowBusNumberEdit(true)}
                            >
                                <Heading>Bus Number</Heading>
                                <Input
                                    type="text"
                                    value={busNumber}
                                    placeholder="Name is not Set"
                                    onChange={(e) => setBusNumber(e.target.value)}
                                    readOnly={showBusNumberEdit}
                                    onKeyDown={handleBusNumberChange}
                                />
                            </div>
                            <Button style={{ marginBottom: "3em" }} onClick={handleSignOut}>Sign Out</Button>
                        </UserInfoWrapper>
                        {showModal ? (
                            <Modal
                                style={{
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        zIndex: 8,
                                        width: "100vw",
                                        height: "100vh",
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <Portal>
                                        <ModalWrapper>
                                            <div>
                                                <Canvas id="c"></Canvas>
                                            </div>
                                            <ImageForm onSubmit={handleUpload} id="uploadForm">
                                                <Input
                                                    type="file"
                                                    id="image"
                                                    onChange={renderToCanvas}
                                                    required
                                                />
                                                <Btn
                                                    type="submit"
                                                    style={{
                                                        display: "block",
                                                        width: "100%"
                                                    }}
                                                    disabled={showUploadBtn}
                                                >Upload</Btn>
                                            </ImageForm>
                                        </ModalWrapper>
                                    </Portal>
                                    <div
                                        style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100vh",
                                            background: "#0000004a",
                                        }}
                                        onClick={() => {
                                            setShowProfile(false);
                                            setShowModal(false);
                                        }}
                                    ></div>
                                </div>
                            </Modal>
                        ) : null}
                    </Wrapper>
                    <CloseWrapper onClick={() => setShowProfile(false)} />
                </>
            ) : (
                ""
            )}
        </Container>
    );
};

export default ProfileBar;
