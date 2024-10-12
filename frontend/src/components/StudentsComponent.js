import React, { useState, useEffect, useRef } from "react";
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Input, useDisclosure, FormControl, FormLabel, FormErrorMessage, Select, useToast
} from "@chakra-ui/react";
import { RiAddCircleLine, RiEditBoxLine, RiDeleteBin6Line } from "react-icons/ri";
import AlertComponent from './AlertComponent';
import * as studentService from "../services/studentsService";
import * as departService from "../services/departmentService";
import * as majorsService from "../services/majorsService";
import * as classService from "../services/classsdService";

const StudentsComponent = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [majors, setMajors] = useState([]);
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectDepartId, setSelectDepartId] = useState(null);

    const [filterClassId, setFilterClassId] = useState(null);
    const [filterDepartId, setFilterDepartId] = useState(null);

    const newStudent = useRef({
        studentname: "", gender: "", birthday: "", citizenid: "", religion: "", phonenumber: "", birthplace: "",
        lveducation: "", email: "", image: "", classid: "", depid: "", majorsid: "", notes: "student"
    });
    const handleStudentIdRef = useRef(null);
    const debounceTimeout = useRef(null);
    const [linkImage, setLinkImage] = useState(null);

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
        fetchStudents();
        fetchDepartments();
        fetchClasses();
        fetchMajors();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentService.getAllStudents();
            setStudents(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sinh viên: ", error);
        }
    };

    const fetchMajors = async () => {
        try {
            const response = await majorsService.getAllMajors();
            setMajors(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ngành: ", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await departService.getAllDepartment();
            setDepartments(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khoa: ", error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await classService.getAllClassSD();
            setClasses(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lớp: ", error);
        }
    };

    const handleAddOrEditStudent = async () => {
        if (validateForm()) {
            const formData = new FormData();
            Object.keys(newStudent.current).forEach(key => {
                formData.append(key, newStudent.current[key]);
            });
            try {
                if (isEditMode) {
                    await studentService.updateStudent(handleStudentIdRef.current, formData);
                    toast({
                        description: "Cập nhật sinh viên thành công",
                        status: 'success',
                    });
                } else {
                    await studentService.createStudent(formData);
                    toast({
                        description: "Thêm sinh viên thành công",
                        status: 'success',
                    });
                }
                fetchStudents();
                onModalClose();
            } catch (error) {
                console.error("Lỗi khi thêm/sửa sinh viên: ", error.response ? error.response.data : error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        if (name === 'classid' || name === 'majorsid') {
            newStudent.current = { ...newStudent.current, [name]: parseInt(value) };
        } else if (name === 'image') {
            const file = e.target.files[0];
            if (linkImage) {
                URL.revokeObjectURL(linkImage);
            }
            const fileURL = URL.createObjectURL(file);
            setLinkImage(fileURL);
            newStudent.current = { ...newStudent.current, image: file };
        } else {
            debounceTimeout.current = setTimeout(() => {
                newStudent.current = { ...newStudent.current, [name]: value };
            }, 500);
        }
    };

    const validateForm = () => {
        let formErrors = {};
        if (!newStudent.current.studentname)
            formErrors.studentname = "Họ tên không được để trống";

        if (!newStudent.current.gender)
            formErrors.gender = "Giới tính không được để trống";

        if (!newStudent.current.birthday)
            formErrors.birthday = "Ngày sinh không được để trống";

        if (!newStudent.current.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.current.email))
            formErrors.email = "Email không hợp lệ";

        if (!newStudent.current.citizenid)
            formErrors.citizenid = "CCCD không được để trống";
        else if (newStudent.current.citizenid.length !== 12)
            formErrors.citizenid = "CCCD gồm 12 số";

        if (!newStudent.current.phonenumber || !/^(\+84|0)\d{9,10}$/.test(newStudent.current.phonenumber))
            formErrors.phonenumber = "Số điện thoại không hợp lệ";

        if (!newStudent.current.birthplace)
            formErrors.birthplace = "Nơi sinh không được để trống";

        if (!newStudent.current.religion)
            formErrors.religion = "Tôn giáo không được để trống";

        if (!newStudent.current.lveducation)
            formErrors.lveducation = "Bậc đào tạo không được để trống";

        if (!newStudent.current.majorsid)
            formErrors.majorsid = "Ngành học không được để trống";

        if (!newStudent.current.depid)
            formErrors.depid = "Khoa không được để trống";

        if (!newStudent.current.classid)
            formErrors.classid = "Lớp học không được để trống";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleDeleteStudent = async () => {
        try {
            await studentService.deleteStudent(handleStudentIdRef.current);
            toast({
                description: "Xóa sinh viên thành công",
                status: 'success',
            });
            fetchStudents();
            onAlertClose();

        } catch (error) {
            toast({
                description: "Lỗi khi xóa sinh viên",
                status: 'error',
            });
        }
    };

    const confirmDelete = (id) => {
        handleStudentIdRef.current = id;
        onAlertOpen();
    };

    const handleEdit = (student) => {
        newStudent.current = {
            studentname: student.studentname,
            gender: student.gender,
            birthday: student.birthday,
            citizenid: student.citizenid,
            religion: student.religion,
            phonenumber: student.phonenumber,
            birthplace: student.birthplace,
            lveducation: student.lveducation,
            email: student.email,
            image: student.image,
            classid: student.classsd.classid,
            depid: student.classsd.department.depid,
            majorsid: student.majors.majorsid,
            notes: "student"
        };
        handleStudentIdRef.current = student.studentid;
        setLinkImage(student.image);
        setIsEditMode(true);
        setSelectDepartId(newStudent.current.depid);
        onModalOpen();
    };

    const filteredStudents = students.filter(student =>
        (student.studentname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.citizenid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.phonenumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.birthday.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.birthplace.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lveducation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(student.studentid) === searchTerm) &&
        (!filterDepartId || student.classsd.department.depid === parseInt(filterDepartId)) &&
        (!filterClassId || student.classsd.classid === parseInt(filterClassId))
    );

    const filteredClassesModal = classes.filter(classItem =>
        classItem.department.depid === parseInt(selectDepartId)
    );

    const filteredClassesTable = classes.filter(classItem =>
        classItem.department.depid === parseInt(filterDepartId)
    );

    return (
        <div className="m-2">
            <h1 className="text-xl text-center font-bold my-6">QUẢN LÝ SINH VIÊN</h1>
            <div className="flex items-center justify-between my-6">
                <div className="flex items-center justify-center gap-4 w-2/5">
                    <h2 className="font-bold">Lọc:</h2>
                    <Select
                        variant='outline'
                        placeholder='Chọn khoa'
                        w="50%"
                        defaultValue={selectDepartId}
                        onChange={(e) => {
                            setFilterDepartId(e.target.value);
                            setFilterClassId(null);
                        }}
                    >
                        {departments.map(department => (
                            <option key={department.depid} value={department.depid}>{department.depname}</option>
                        ))}
                    </Select>
                    <Select
                        variant='outline'
                        placeholder='Chọn lớp'
                        w="30%"
                        onChange={(e) => setFilterClassId(e.target.value)}
                        disabled={!filterDepartId}
                    >
                        {filteredClassesTable.map(classItem => (
                            <option key={classItem.classid} value={classItem.classid}>{classItem.classname}</option>
                        ))}
                    </Select>
                </div>
                <div className="w-3/5 flex items-center justify-end">
                    <Input
                        variant='outline'
                        placeholder='Tìm kiếm sinh viên...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        w="50%"
                    />
                    <Button colorScheme="blue" className="ml-4 w-fit" onClick={() => {
                        onModalOpen();
                        newStudent.current = {
                            studentname: "", gender: "", birthday: "", citizenid: "", religion: "", phonenumber: "", birthplace: "",
                            lveducation: "", email: "", image: "", classid: "", depid: "", majorsid: "", notes: "student"
                        };
                        setIsEditMode(false);
                        setSelectDepartId(null);
                        setErrors({});
                    }}
                    >
                        <RiAddCircleLine className="mr-2 size-6" />
                        Thêm sinh viên
                    </Button>
                </div>
            </div>


            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Ảnh</th>
                        <th className="border p-2">Họ Tên</th>
                        <th className="border p-2">Giới Tính</th>
                        <th className="border p-2">Ngày Sinh</th>
                        <th className="border p-2">Nơi Sinh</th>
                        <th className="border p-2">CCCD</th>
                        <th className="border p-2">SĐT</th>
                        <th className="border p-2">Tôn Giáo</th>
                        <th className="border p-2">Bậc ĐT</th>
                        <th className="border p-2">Ngành</th>
                        <th className="border p-2">Lớp</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="border ">
                    {
                        filteredStudents.map(student => (
                            <tr key={student.studentid} className="hover:bg-gray-50">
                                <td className="border p-1 text-sm text-center">{student.studentid}</td>
                                <td className="border p-1 text-sm">
                                    <img src={student.image} alt="Ảnh sinh viên" className="w-14 h-14 object-cover rounded" />
                                </td>
                                <td className="border p-1 text-sm truncate ">{student.studentname}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.gender}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.birthday}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.birthplace}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.citizenid}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.phonenumber}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.religion}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.lveducation}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.majors.majorsname}</td>
                                <td className="border p-1 text-sm truncate text-center">{student.classsd.classname}</td>
                                <td className="border p-1 text-sm truncate max-w-14">{student.email}</td>
                                <td className="border p-1 text-nowrap">
                                    <Button colorScheme="orange" className="w-fit flex items-center"
                                        onClick={() => handleEdit(student)}>
                                        <RiEditBoxLine className="mr-2 size-5" />
                                        Sửa
                                    </Button>
                                    <Button colorScheme="red" className="ml-1 w-fit flex items-center"
                                        onClick={() => confirmDelete(student.studentid)}>
                                        <RiDeleteBin6Line className="mr-2 size-5" />
                                        Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={onModalClose} size={"3xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="text-center">{isEditMode ? "Cập Nhật Sinh Viên" : "Thêm Sinh Viên"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div className="flex gap-2 items-center">
                            <FormControl isInvalid={errors.studentname}>
                                <FormLabel htmlFor="studentname">Họ Tên</FormLabel>
                                <Input
                                    id="studentname"
                                    name="studentname"
                                    defaultValue={newStudent.current.studentname}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.studentname}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.gender} className="mt-2">
                                <FormLabel htmlFor="gender">Giới Tính</FormLabel>
                                <Select
                                    id="gender"
                                    name="gender"
                                    defaultValue={newStudent.current.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </Select>
                                <FormErrorMessage>{errors.gender}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.birthday} className="mt-2">
                                <FormLabel htmlFor="birthday">Ngày Sinh</FormLabel>
                                <Input
                                    id="birthday"
                                    type="date"
                                    name="birthday"
                                    defaultValue={newStudent.current.birthday}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.birthday}</FormErrorMessage>
                            </FormControl>
                        </div>
                        <div className="flex gap-2 items-center">
                            <FormControl isInvalid={errors.birthplace} className="mt-2">
                                <FormLabel htmlFor="birthplace">Nơi Sinh</FormLabel>
                                <Input
                                    id="birthplace"
                                    name="birthplace"
                                    defaultValue={newStudent.current.birthplace}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.birthplace}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.phonenumber} className="mt-2">
                                <FormLabel htmlFor="phonenumber">Số Điện Thoại</FormLabel>
                                <Input
                                    id="phonenumber"
                                    name="phonenumber"
                                    type="number"
                                    defaultValue={newStudent.current.phonenumber}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.phonenumber}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.citizenid} className="mt-2">
                                <FormLabel htmlFor="citizenid">CCCD</FormLabel>
                                <Input
                                    id="citizenid"
                                    name="citizenid"
                                    type="number"
                                    defaultValue={newStudent.current.citizenid}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.citizenid}</FormErrorMessage>
                            </FormControl>
                        </div>
                        <div className="flex gap-2 items-center">
                            <FormControl isInvalid={errors.religion} className="mt-2">
                                <FormLabel htmlFor="religion">Tôn Giáo</FormLabel>
                                <Input
                                    id="religion"
                                    name="religion"
                                    defaultValue={newStudent.current.religion}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.religion}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.lveducation} className="mt-2">
                                <FormLabel htmlFor="lveducation">Bậc Đào Tạo</FormLabel>
                                <Select
                                    id="lveducation"
                                    name="lveducation"
                                    defaultValue={newStudent.current.lveducation}
                                    onChange={handleInputChange}

                                >
                                    <option value="">Chọn bậc đào tạo</option>
                                    <option value="Đại học">Đại học</option>
                                    <option value="Cao đẳng">Cao đẳng</option>
                                    <option value="Trung cấp">Trung cấp</option>

                                </Select>
                                <FormErrorMessage>{errors.lveducation}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.email} className="mt-2">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={newStudent.current.email}
                                    onChange={handleInputChange}
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                        </div>
                        <div className="flex gap-2 items-center">
                            <FormControl isInvalid={errors.majorsid} className="mt-2">
                                <FormLabel htmlFor="majorsid">Ngành</FormLabel>
                                <Select
                                    id="majorsid"
                                    name="majorsid"
                                    defaultValue={newStudent.current.majorsid}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn ngành học</option>
                                    {majors.map((major) => (
                                        <option key={major.majorsid} value={major.majorsid}>
                                            {major.majorsname}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.majorsid}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.depid} className="mt-2">
                                <FormLabel htmlFor="depid">Khoa</FormLabel>
                                <Select
                                    id="depid"
                                    name="depid"
                                    defaultValue={newStudent.current.depid}
                                    onChange={(e) => {
                                        setSelectDepartId(e.target.value);
                                        handleInputChange(e);
                                    }}
                                >
                                    <option value="">Chọn khoa</option>
                                    {departments.map((department) => (
                                        <option key={department.depid} value={department.depid}>
                                            {department.depname}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.depid}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.classid} className="mt-2">
                                <FormLabel htmlFor="classid">Lớp Học</FormLabel>
                                <Select
                                    id="classid"
                                    name="classid"
                                    defaultValue={newStudent.current.classid}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn lớp học</option>
                                    {filteredClassesModal.map((classItem) => (
                                        <option key={classItem.classid} value={classItem.classid}>
                                            {classItem.classname}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.classid}</FormErrorMessage>
                            </FormControl>
                        </div>
                        <FormControl className="mt-2">
                            <FormLabel htmlFor="image">Ảnh</FormLabel>
                            <div className="flex gap-3">
                                <Input type="file" name="image" accept="image/*" w={230}
                                    onChange={handleInputChange}
                                />
                                <div className="w-24 h-24 border-solid border-4 border-blue-400 rounded overflow-hidden">
                                    <img src={linkImage} alt="" className="object-cover" />
                                </div>

                            </div>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleAddOrEditStudent}>
                            {isEditMode ? "Cập nhật" : "Thêm"}
                        </Button>
                        <Button onClick={onModalClose} ml={3}>
                            Hủy
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <AlertComponent
                isOpen={isAlertOpen}
                onClose={onAlertClose}
                callback={handleDeleteStudent}
                message="Bạn có chắc chắn muốn xóa sinh viên này?"
            />
        </div>
    );
};

export default StudentsComponent;

