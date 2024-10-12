import React, { useState, useRef, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import {
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Button, Input, FormControl, FormLabel, FormErrorMessage, useToast
} from "@chakra-ui/react";

import AlertComponent from '../components/AlertComponent';
import { RiArrowRightSFill, RiLogoutBoxLine, RiLockPasswordLine } from "react-icons/ri";
import logo from '../avatar.jpg';

import StudentsComponent from '../components/StudentsComponent';
import MajorsComponent from '../components/MajorsComponent';
import DepartmentComponent from '../components/DepartmentComponent';
import ClassSDComponent from '../components/ClassSDComponent';
import ResultComponent from '../components/ResultComponent';

import * as studentsService from '../services/studentsService';

const AdminPage = () => {
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const formPassword = useRef({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        idAccount: ""
    })

    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose
    } = useDisclosure();

    const {
        isOpen: isPasswordModalOpen,
        onOpen: onPasswordModalOpen,
        onClose: onPasswordModalClose
    } = useDisclosure();

    const toast = useToast({
        title: 'Thông báo',
        duration: 3000,
        position: 'top',
        isClosable: true,
    });

    useEffect(() => {
        formPassword.current.idAccount = sessionStorage.getItem('user');
    }, []);

    const handlePasswordChange = async () => {
        const formError = {};

        if (!formPassword.current.oldPassword)
            formError.oldPass = "Mật khẩu hiện tại không được để trống";

        if (!formPassword.current.newPassword)
            formError.newPass = "Mật khẩu mới không được để trống";
        else if (formPassword.current.newPassword.length < 8)
            formError.newPass = "Mật khẩu mới phải có ít nhất 8 kí tự";

        if (!formPassword.current.confirmPassword)
            formError.confirmPass = "Mật khẩu xác nhận không được để trống";
        else if (formPassword.current.confirmPassword !== formPassword.current.newPassword)
            formError.confirmPass = "Mật khẩu xác nhận không khớp với mật khẩu mới";

        if (Object.keys(formError).length !== 0) {
            setError(formError);
            return;
        }

        const formData = new FormData();
        formData.append("oldPassword", formPassword.current.oldPassword);
        formData.append("newPassword", formPassword.current.newPassword);
        formData.append("id", formPassword.current.idAccount);

        try {
            await studentsService.changePassword(formData);

            toast({
                description: "Đổi mật khẩu thành công",
                status: 'success',
            });
        } catch (e) {
            const errorMessage = e.response?.data || "Lỗi khi thay đổi mật khẩu";
            toast({
                description: errorMessage,
                status: 'error',
            });
        }
        onPasswordModalClose();
    };

    return (
        <div className="flex">
            <div className="flex flex-col h-screen bg-sky-950 text-white w-64">
                <h1 className="text-xl text-center font-bold my-10">QUẢN LÝ THÔNG TIN SINH VIÊN</h1>
                <ul className="flex flex-col h-full">
                    <li>
                        <Link to="/admin/student"
                            className="hover:bg-sky-900 p-2 text-lg pl-10 flex items-center">
                            <RiArrowRightSFill className='mr-2 size-8' />
                            Sinh Viên
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/result"
                            className="hover:bg-sky-900 p-2 text-lg pl-10 flex items-center">
                            <RiArrowRightSFill className='mr-2 size-8' />
                            Điểm
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/class"
                            className="hover:bg-sky-900 p-2 text-lg pl-10 flex items-center">
                            <RiArrowRightSFill className='mr-2 size-8' />
                            Lớp học
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/majors"
                            className="hover:bg-sky-900 p-2 text-lg pl-10 flex items-center">
                            <RiArrowRightSFill className='mr-2 size-8' />
                            Ngành học
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/department"
                            className="hover:bg-sky-900 p-2 text-lg pl-10 flex items-center">
                            <RiArrowRightSFill className='mr-2 size-8' />
                            Khoa
                        </Link>
                    </li>
                    <li className="hover:bg-sky-900 p-2 text-lg pl-10 cursor-pointer mt-auto mb-6 flex items-center" onClick={onAlertOpen}>
                        <RiLogoutBoxLine className='mr-2 size-7' />
                        Đăng xuất
                    </li>
                </ul>
            </div>
            <div className="flex-grow relative">
                <Routes>
                    <Route path="/student" element={<StudentsComponent />} />
                    <Route path="/majors" element={<MajorsComponent />} />
                    <Route path="/department" element={<DepartmentComponent />} />
                    <Route path="/class" element={<ClassSDComponent />} />
                    <Route path="/result" element={<ResultComponent />} />
                </Routes>

                <div className="absolute top-4 right-4 flex items-center space-x-4">
                    <img src={logo} alt="Logo" className="w-8 h-8 rounded-full border-gray-400 border-4 border-solid" />

                    <Button className="flex items-center underline" size={"sm"}
                        onClick={() => {
                            formPassword.current.oldPassword = "";
                            formPassword.current.newPassword = "";
                            formPassword.current.confirmPassword = "";
                            setError({})
                            onPasswordModalOpen();
                        }}>
                        Đổi mật khẩu
                        <RiLockPasswordLine className="size-5 ml-1" />
                    </Button>
                </div>
            </div>

            <Modal isOpen={isPasswordModalOpen} onClose={onPasswordModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className='text-center'>Đổi Mật Khẩu</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={error.oldPass}>
                            <FormLabel>Mật khẩu hiện tại</FormLabel>
                            <Input
                                placeholder="Mật khẩu hiện tại"
                                defaultValue={formPassword.current.oldPassword}
                                onChange={(e) => formPassword.current.oldPassword = e.target.value.trim()}
                            />
                            {error.oldPass && (
                                <FormErrorMessage>{error.oldPass}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={error.newPass} mt={4}>
                            <FormLabel>Mật khẩu mới</FormLabel>
                            <Input
                                placeholder="Mật khẩu mới"
                                type="password"
                                defaultValue={formPassword.current.newPassword}
                                onChange={(e) => formPassword.current.newPassword = e.target.value.trim()}
                            />
                            {error.newPass && (
                                <FormErrorMessage>{error.newPass}</FormErrorMessage>
                            )}
                        </FormControl>
                        <FormControl isInvalid={error.confirmPass} mt={4}>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <Input
                                placeholder="Xác nhận lại mật khẩu"
                                type="password"
                                defaultValue={formPassword.current.confirmPassword}
                                onChange={(e) => formPassword.current.confirmPassword = e.target.value.trim()}
                            />
                            {error.confirmPass && (
                                <FormErrorMessage>{error.confirmPass}</FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handlePasswordChange}>
                            Xác nhận
                        </Button>
                        <Button variant="ghost" onClick={onPasswordModalClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertComponent
                title="Thông báo"
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                buttonClose="Không"
                buttonAction="Xác nhận"
                size={"sm"}
                callback={() => {
                    sessionStorage.removeItem('user');
                    navigate('/login');
                }}
                message="Bạn có đăng xuất không?"
            />
        </div>
    );
};

export default AdminPage;
