import React, { useState, useEffect, useRef } from "react";
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Input, useDisclosure, useToast, FormControl, FormLabel, FormErrorMessage
} from "@chakra-ui/react";
import { RiAddCircleLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";

import * as departmentService from "../services/departmentService";
import AlertComponent from './AlertComponent';

const DepartmentComponent = () => {
    const [depart, setDepart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});

    const newDepartRef = useRef({ depName: '' });
    const handleDepartIdRef = useRef(null);

    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose
    } = useDisclosure();

    const {
        isOpen: isAlertOpen,
        onOpen: onAlertOpen,
        onClose: onAlertClose
    } = useDisclosure();

    const toast = useToast({
        title: 'Thông báo',
        duration: 3000,
        position: 'top',
        isClosable: true,
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartment();
            setDepart(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách: ", error);
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!newDepartRef.current.depName.trim()) {
            formErrors.depName = "Tên khoa là bắt buộc!";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddOrEditDepart = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const data = {
                depname: newDepartRef.current.depName
            }
            if (editMode) {
                const departExists = depart.some((item, index) =>
                    item.depname.toLowerCase() === newDepartRef.current.depName.toLowerCase() &&
                    index !== handleDepartIdRef.current
                );

                if (departExists) {
                    toast({
                        description: `Khoa "${newDepartRef.current.depName}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }
                await departmentService.updateDepartment(handleDepartIdRef.current, data);
                toast({
                    description: "Chỉnh sửa khoa thành công",
                    status: 'success',
                });
            } else {
                const departExists = depart.some(item =>
                    item.depname.toLowerCase() === newDepartRef.current.depName.toLowerCase()
                );

                if (departExists) {
                    toast({
                        description: `Khoa "${newDepartRef.current.depName}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }

                await departmentService.createDepartment(data);
                toast({
                    description: "Thêm khoa mới thành công",
                    status: 'success',
                });
            }
            fetchDepartments();
            onModalClose();
            setEditMode(false);
            newDepartRef.current.depName = "";
            setErrors({});
        } catch (error) {
            toast({
                description: "Lỗi khi thêm/chỉnh sửa khoa",
                status: 'error',
            });
        }
    };

    const handleEdit = (department) => {
        newDepartRef.current.depName = department.depname;
        handleDepartIdRef.current = department.depid;
        setEditMode(true);
        onModalOpen();
    };

    const handleDeleteDepartment = async () => {
        try {
            await departmentService.deleteDepartment(handleDepartIdRef.current);
            fetchDepartments();
            toast({
                description: "Xóa khoa thành công",
                status: 'success',
            });
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi xóa khoa";
            toast({
                description: errorMessage,
                status: 'error',
            });
        }
        onAlertClose();
    };

    const confirmDelete = (id) => {
        handleDepartIdRef.current = id;
        onAlertOpen();
    };

    const filteredDepart = depart.filter(department =>
        String(department.depid) === searchTerm ||
        department.depname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="m-2">
            <h1 className="text-xl text-center font-bold my-6">QUẢN LÝ KHOA</h1>
            <div className="flex items-center justify-end gap-4 my-6">
                <Input
                    variant='outline'
                    placeholder='Tìm kiếm khoa...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    w="30%"
                />
                <Button colorScheme="blue" className="ml-4 w-fit" onClick={() => {
                    setErrors({});
                    newDepartRef.current.depName = "";
                    onModalOpen();
                }}>
                    <RiAddCircleLine className="mr-2 size-6" />
                    Thêm khoa
                </Button>
            </div>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên khoa</th>
                        <th className="border p-2">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredDepart.map(department => (
                            <tr key={department.depid} className="hover:bg-gray-50">
                                <td className="border p-1 text-sm text-center">{department.depid}</td>
                                <td className="border p-1 text-sm text-center">{department.depname}</td>
                                <td className="border p-1 text-center">
                                    <Button colorScheme="orange" className="ml-4 w-fit"
                                        onClick={() => handleEdit(department)}>
                                        <RiEditBoxLine className="mr-2 size-5" />
                                        Sửa
                                    </Button>
                                    <Button colorScheme="red" className="ml-4 w-fit"
                                        onClick={() => confirmDelete(department.depid)}>
                                        <RiDeleteBin6Line className="mr-2 size-5" />
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{editMode ? 'Chỉnh sửa khoa' : 'Thêm khoa mới'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={errors.depName}>
                            <FormLabel>Tên khoa</FormLabel>
                            <Input
                                placeholder="Tên khoa"
                                defaultValue={newDepartRef.current.depName}
                                onChange={(e) => newDepartRef.current.depName = e.target.value.trim()}
                            />
                            {errors.depName && (
                                <FormErrorMessage>{errors.depName}</FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddOrEditDepart}>
                            {editMode ? 'Cập nhật' : 'Thêm'}
                        </Button>
                        <Button onClick={onModalClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertComponent
                callback={handleDeleteDepartment}
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                message="Bạn có chắc chắn muốn xóa khoa này không?"
            />
        </div>
    );
};

export default DepartmentComponent;
