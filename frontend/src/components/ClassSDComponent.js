import React, { useState, useEffect, useRef } from "react";
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Input, Select, useDisclosure, useToast, FormControl, FormLabel, FormErrorMessage
} from "@chakra-ui/react";
import { RiAddCircleLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import * as classsdService from "../services/classsdService";
import * as departmentService from "../services/departmentService";
import AlertComponent from './AlertComponent';

const ClassSDComponent = () => {
    const [classSD, setClassSD] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClassSDIdRef = useRef(null);
    const formDataRef = useRef({
        className: '',
        course: '',
        depID: '',
        startYear: '',
        endYear: ''
    });
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


    const createYearsArray = (yearsBefore = 5, yearsAfter = 5) => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear + yearsAfter + 1; i > currentYear; i--) {
            years.push(i);
        }

        for (let i = currentYear; i >= currentYear - yearsBefore; i--) {
            years.push(i);
        }

        return years;
    }
    const yearsArrayRef = useRef([])
    useEffect(() => {
        fetchClassSD();
        fetchDepartments();
        yearsArrayRef.current = createYearsArray();
    }, []);

    const fetchClassSD = async () => {
        try {
            const response = await classsdService.getAllClassSD();
            setClassSD(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lớp SD: ", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getAllDepartment();
            setDepartments(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khoa: ", error);
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formDataRef.current.className) {
            formErrors.className = "Tên lớp là bắt buộc!";
        }
        if (!formDataRef.current.depID) {
            formErrors.depID = "Khoa là bắt buộc!";
        }
        if (!formDataRef.current.startYear || !formDataRef.current.endYear) {
            formErrors.course = "Niên khóa là bắt buộc!";
        } else if (formDataRef.current.endYear - formDataRef.current.startYear < 3) {
            formErrors.course = "Hai năm phải cách nhau ít nhất 3 năm!";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddOrEditClassSD = async () => {
        if (!validateForm()) {
            return;
        }
        const newClassSD = {
            classname: formDataRef.current.className,
            course: `${formDataRef.current.startYear} - ${formDataRef.current.endYear}`,
            depid: formDataRef.current.depID,
        };

        try {
            if (editMode) {
                const classExists = classSD.some((item, index) =>
                    item.classname.toLowerCase() === formDataRef.current.className.toLowerCase() &&
                    index !== handleClassSDIdRef.current
                );

                if (classExists) {
                    toast({
                        description: `Lớp học "${formDataRef.current.className}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }
                await classsdService.updateClassSD(handleClassSDIdRef.current, newClassSD);
                toast({
                    description: "Chỉnh sửa lớp thành công",
                    status: 'success',
                });
            } else {
                const classExists = classSD.some(item =>
                    item.classname.toLowerCase() === formDataRef.current.className.toLowerCase()
                );

                if (classExists) {
                    toast({
                        description: `Lớp học "${formDataRef.current.className}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }
                await classsdService.createClassSD(newClassSD);
                toast({
                    description: "Thêm lớp mới thành công",
                    status: 'success',
                });
            }
            fetchClassSD();
            onModalClose();
            setEditMode(false);
            setErrors({});
        } catch (error) {
            toast({
                description: "Lỗi khi thêm/chỉnh sửa lớp",
                status: 'error',
            });
        }
    };

    const handleEdit = (classItem) => {
        formDataRef.current.className = classItem.classname;
        const [startYear, endYear] = classItem.course.split(' - ').map(Number);
        formDataRef.current.startYear = startYear;
        formDataRef.current.endYear = endYear;
        formDataRef.current.depID = classItem.department.depid;
        handleClassSDIdRef.current = classItem.classid;
        setEditMode(true);
        onModalOpen();
    };

    const handleDeleteClass = async () => {
        try {
            await classsdService.deleteClassSD(handleClassSDIdRef.current);
            fetchClassSD();
            toast({
                description: "Xóa lớp thành công",
                status: 'success',
            });
            onAlertClose();
        } catch (error) {
            const errorMessage = error.response?.data || "Lỗi khi xóa lớp";
            toast({
                description: errorMessage,
                status: 'error',
            });
            onAlertClose();

        }
    };


    const confirmDelete = (id) => {
        handleClassSDIdRef.current = id;
        onAlertOpen();
    };

    const filteredClassSD = classSD.filter(classItem =>
        String(classItem.classid) === searchTerm ||
        classItem.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.department.depname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="m-2">
            <h1 className="text-xl text-center font-bold my-6">QUẢN LÝ LỚP HỌC</h1>

            <div className="flex items-center justify-end my-6 gap-4">
                <Input
                    variant='outline'
                    placeholder='Tìm kiếm lớp...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    w="30%"
                />
                <Button colorScheme="blue" className="w-fit" onClick={() => {
                    setEditMode(false);
                    formDataRef.current = {
                        classname: '',
                        startYear: '',
                        endYear: '',
                        depid: ''
                    };
                    setErrors({});
                    onModalOpen();
                }}>
                    <RiAddCircleLine className="mr-2 size-6" />
                    Thêm lớp
                </Button>
            </div>

            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Tên lớp</th>
                        <th className="border p-2">Khóa</th>
                        <th className="border p-2">Khoa</th>
                        <th className="border p-2">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredClassSD.map(classItem => (
                            <tr key={classItem.classid} className="hover:bg-gray-50">
                                <td className="border p-1 text-sm text-center">{classItem.classid}</td>
                                <td className="border p-1 text-sm text-center">{classItem.classname}</td>
                                <td className="border p-1 text-sm text-center">{classItem.course}</td>
                                <td className="border p-1 text-sm text-center">{classItem.department.depname}</td>
                                <td className="border p-1 text-center">
                                    <Button colorScheme="orange" className="ml-4 w-fit"
                                        onClick={() => handleEdit(classItem)}>
                                        <RiEditBoxLine className="mr-2 size-5" />
                                        Sửa
                                    </Button>
                                    <Button colorScheme="red" className="ml-4 w-fit"
                                        onClick={() => confirmDelete(classItem.classid)}>
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
                    <ModalHeader>{editMode ? 'Chỉnh sửa lớp' : 'Thêm lớp mới'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={errors.className}>
                            <FormLabel>Tên lớp</FormLabel>
                            <Input
                                placeholder="Tên lớp"
                                defaultValue={formDataRef.current.className}
                                onChange={(e) => formDataRef.current.className = e.target.value.trim()}
                            />
                            {errors.className && (
                                <FormErrorMessage>{errors.className}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isInvalid={errors.course} mt={4}>
                            <FormLabel>Niên Khóa</FormLabel>
                            <div className="flex gap-4">
                                <Select
                                    placeholder="Chọn năm bắt đầu"
                                    defaultValue={formDataRef.current.startYear}
                                    onChange={(e) => {
                                        formDataRef.current.startYear = parseInt(e.target.value);
                                    }}
                                >
                                    {yearsArrayRef.current.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </Select>
                                <Select
                                    placeholder="Chọn năm kết thúc"
                                    defaultValue={formDataRef.current.endYear}
                                    onChange={(e) => {
                                        formDataRef.current.endYear = parseInt(e.target.value);
                                    }}
                                >
                                    {yearsArrayRef.current.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </Select>
                            </div>
                            {errors.course && (
                                <FormErrorMessage>{errors.course}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isInvalid={errors.depID} mt={4}>
                            <FormLabel>Khoa</FormLabel>
                            <Select
                                placeholder="Chọn khoa"
                                defaultValue={formDataRef.current.depID}
                                onChange={(e) => formDataRef.current.depID = parseInt(e.target.value)}
                            >
                                {departments.map(department => (
                                    <option key={department.depid} value={department.depid}>
                                        {department.depname}
                                    </option>
                                ))}
                            </Select>
                            {errors.depID && (
                                <FormErrorMessage>{errors.depID}</FormErrorMessage>
                            )}
                        </FormControl>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleAddOrEditClassSD}>
                            {editMode ? 'Cập nhật' : 'Thêm'}
                        </Button>
                        <Button onClick={onModalClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertComponent
                callback={handleDeleteClass}
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                message="Bạn có chắc chắn muốn xóa lớp học này không?"
            />
        </div>
    );
};

export default ClassSDComponent;

