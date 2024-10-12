import React, { useState, useEffect, useRef } from "react";
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Input, useDisclosure, useToast, FormControl, FormLabel, FormErrorMessage
} from "@chakra-ui/react";
import { RiAddCircleLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import * as majorsService from "../services/majorsService";
import AlertComponent from './AlertComponent';

const MajorsConponent = () => {
    const [majors, setMajors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});

    const handleMajorsIdRef = useRef(null);
    const newMajorsRef = useRef({ majorsName: '' });

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
        fetchMajors();
    }, []);

    const fetchMajors = async () => {
        try {
            const response = await majorsService.getAllMajors();
            setMajors(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách: ", error);
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!newMajorsRef.current.majorsName) {
            formErrors.majorsName = "Tên ngành học là bắt buộc!";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddOrEditMajors = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const data = {
                majorsname: newMajorsRef.current.majorsName
            }
            if (editMode) {
                const majorsExists = majors.some((item, index) =>
                    item.majorsname.toLowerCase() === newMajorsRef.current.majorsName.toLowerCase() &&
                    index !== handleMajorsIdRef.current
                );

                if (majorsExists) {
                    toast({
                        description: `Ngành học "${newMajorsRef.current.majorsName}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }

                await majorsService.updateMajors(handleMajorsIdRef.current, data);
                toast({
                    description: "Chỉnh sửa ngành thành công",
                    status: 'success',
                });
            } else {
                const majorsExists = majors.some(item =>
                    item.majorsname.toLowerCase() === newMajorsRef.current.majorsName.toLowerCase()
                );

                if (majorsExists) {
                    toast({
                        description: `Ngành học "${newMajorsRef.current.majorsName}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }

                await majorsService.createMajors(data);
                toast({
                    description: "Thêm ngành mới thành công",
                    status: 'success',
                });
            }
            fetchMajors();
            onModalClose();
            setEditMode(false);
            newMajorsRef.current.majorsName = ''; // Reset the ref value
            setErrors({});
        } catch (error) {
            toast({
                description: "Lỗi khi thêm/chỉnh sửa ngành học",
                status: 'error',
            });
        }
    };

    const handleEdit = (majors) => {
        newMajorsRef.current.majorsName = majors.majorsname; // Set the ref value for editing
        handleMajorsIdRef.current = majors.majorsid;
        setEditMode(true);
        onModalOpen();
    };

    const handleDeleteMajors = async () => {
        try {
            await majorsService.deleteMajors(handleMajorsIdRef.current);
            fetchMajors();
            toast({
                description: "Xóa chuyên ngành thành công",
                status: 'success',
            });
            onAlertClose();
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi xóa chuyên ngành";
            toast({
                description: errorMessage,
                status: 'error',
            });
            onAlertClose();

        }
    };

    const confirmDelete = (id) => {
        handleMajorsIdRef.current = id;
        onAlertOpen();
    };

    const filteredMajors = majors.filter(major =>
        String(major.majorsid) === searchTerm ||
        major.majorsname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="m-2">
            <h1 className="text-xl text-center font-bold my-6">QUẢN LÝ NGÀNH HỌC</h1>
            <div className="flex items-center justify-end my-6 gap-4">

                <Input
                    variant='outline'
                    placeholder='Tìm kiếm ngành học...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    w="30%"
                />
                <Button colorScheme="blue" className="w-fit" onClick={() => {
                    setEditMode(false);
                    newMajorsRef.current.majorsName = ''; // Reset the ref value
                    onModalOpen();
                }}>
                    <RiAddCircleLine className="mr-2 size-6" />
                    Thêm ngành học
                </Button>

            </div>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên ngành học</th>
                        <th className="border p-2">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredMajors.map(majors => (
                            <tr key={majors.majorsid} className="hover:bg-gray-50">
                                <td className="border p-1 text-sm text-center">{majors.majorsid}</td>
                                <td className="border p-1 text-sm text-center">{majors.majorsname}</td>
                                <td className="border p-1 text-center">
                                    <Button colorScheme="orange" className="ml-4 w-fit"
                                        onClick={() => handleEdit(majors)}>
                                        <RiEditBoxLine className="mr-2 size-5" />
                                        Sửa
                                    </Button>
                                    <Button colorScheme="red" className="ml-4 w-fit"
                                        onClick={() => confirmDelete(majors.majorsid)}>
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
                    <ModalHeader>{editMode ? 'Chỉnh sửa ngành học' : 'Thêm ngành học mới'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={errors.majorsName}>
                            <FormLabel>Tên ngành học</FormLabel>
                            <Input
                                placeholder="Tên ngành học"
                                defaultValue={newMajorsRef.current.majorsName}
                                onChange={(e) => newMajorsRef.current.majorsName = e.target.value.trim()}
                            />
                            {errors.majorsName && (
                                <FormErrorMessage>{errors.majorsName}</FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddOrEditMajors}>
                            {editMode ? 'Cập nhật' : 'Thêm'}
                        </Button>
                        <Button onClick={onModalClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertComponent
                callback={handleDeleteMajors}
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                message="Bạn có chắc chắn muốn xóa ngành học này không?"
            />
        </div>
    );
}

export default MajorsConponent;
