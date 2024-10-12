import React, { useState, useEffect, useRef } from "react";
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Input, useDisclosure, FormControl, FormLabel, Select, useToast, FormErrorMessage
} from "@chakra-ui/react";
import { RiAddCircleLine, RiEditBoxLine, RiDeleteBin6Line, RiArrowRightCircleLine, RiSave3Line } from "react-icons/ri";
import AlertComponent from './AlertComponent';

import * as studentService from "../services/studentsService";
import * as departService from "../services/departmentService";
import * as classService from "../services/classsdService";
import * as resultService from "../services/resultService";

const ResultComponent = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [results, setResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [studentGrades, setStudentGrades] = useState([]);

    const [searchStudent, setSearchStudent] = useState('');

    const [filterClassId, setFilterClassId] = useState(null);
    const [filterDepartId, setFilterDepartId] = useState(null);

    const selectGradeIndex = useRef("")
    const selectStudent = useRef({
        studentID: "",
        studentName: "",
        studentClasses: "",
        studentYear: "",
        studentSemester: "",
        studentGrade: "",
        studentCourse: "",
        filterYear: "",
        filterSemester: ""
    })

    const toast = useToast({
        title: 'Thông báo',
        duration: 3000,
        position: 'top',
        isClosable: true,
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

    const createYearsArray = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i > currentYear - 5; i--) {
            years.push(`${i} - ${i + 1}`);
        }
        return years;
    }

    const yearsArrayRef = useRef([])

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
        fetchClasses();
        yearsArrayRef.current = createYearsArray();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentService.getAllStudents();
            setStudents(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sinh viên: ", error);
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

    const fetchResultsByStudentId = async (studentId) => {
        try {
            const response = await resultService.getResultByStudentId(studentId);
            setResults(response.data);
        } catch (error) {
            toast({
                description: `Lỗi ${error}`,
                status: "error"
            });
        }
    };

    const handleStudentSelect = async (student) => {
        selectStudent.current.studentID = student.studentid;
        selectStudent.current.studentName = student.studentname;
        selectStudent.current.studentClasses = student.classsd.classname;

        setStudentGrades([]);
        selectStudent.current.filterYear = "";
        selectStudent.current.filterSemester = "";

        await fetchResultsByStudentId(student.studentid);

        toast({
            description: `Chọn sinh viên thành công.`,
            status: "success"
        });
    };


    const validateForm = () => {
        let formErrors = {};
        if (!selectStudent.current.studentID) {
            toast({
                description: `Chọn sinh viên để thêm điểm`,
                status: "warning"
            });
            return;
        }

        if (!selectStudent.current.filterYear || !selectStudent.current.filterSemester) {
            toast({
                description: `Chọn năm học và học kì để thêm điểm`,
                status: "warning"
            });
            return;
        }

        if (!selectStudent.current.studentCourse.trim()) {
            formErrors.studentCourse = "Môn học là bắt buộc!";
        }

        if (!selectStudent.current.studentGrade) {
            formErrors.studentGrade = "Điểm là bắt buộc!";
        } else if (isNaN(selectStudent.current.studentGrade) || selectStudent.current.studentGrade < 0 || selectStudent.current.studentGrade > 10) {
            formErrors.studentGrade = "Điểm phải nằm trong khoảng từ 0 đến 10!";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleAddOrEditGrade = () => {
        if (validateForm()) {
            if (isEditMode) {
                const courseExists = studentGrades.some((grade, index) =>
                    grade.course.toLowerCase() === selectStudent.current.studentCourse.toLowerCase() &&
                    index !== selectGradeIndex.current
                );

                if (courseExists) {
                    toast({
                        description: `Môn học "${selectStudent.current.studentCourse}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }

                const updatedGrades = [...studentGrades];
                updatedGrades[selectGradeIndex.current] = {
                    grade: selectStudent.current.studentGrade,
                    course: selectStudent.current.studentCourse
                };
                setStudentGrades(updatedGrades);
                toast({
                    description: `Cập nhật điểm thành công.`,
                    status: "success"
                });
            } else {
                const courseExists = studentGrades.some(grade =>
                    grade.course.toLowerCase() === selectStudent.current.studentCourse.toLowerCase()
                );

                if (courseExists) {
                    toast({
                        description: `Môn học "${selectStudent.current.studentCourse}" đã tồn tại!`,
                        status: "warning"
                    });
                    return;
                }
                setStudentGrades([
                    ...studentGrades,
                    {
                        grade: selectStudent.current.studentGrade,
                        course: selectStudent.current.studentCourse,
                    }
                ]);
                toast({
                    description: `Thêm điểm thành công.`,
                    status: "success"
                });
            }
            onModalClose();
        }
    };


    const handleEditGrade = (item) => {
        selectStudent.current.studentGrade = item.grade
        selectStudent.current.studentCourse = item.course
        onModalOpen();
    }

    const handleDeleteGrade = () => {
        const grades = studentGrades;
        grades.splice(selectGradeIndex.current, 1);
        setStudentGrades(grades);
        toast({
            description: `Xóa điểm thành công.`,
            status: "success"
        });
        onAlertClose();
    }

    const handleSaveGrade = async () => {
        try {
            const existingResult = results.find(result =>
                result.year === selectStudent.current.filterYear &&
                result.semester === selectStudent.current.filterSemester
            );

            const newContent = studentGrades.map(item => `${item.course}: ${item.grade}`).join(', ');
            const newGrade = {
                content: newContent,
                year: selectStudent.current.filterYear,
                semester: selectStudent.current.filterSemester,
                studentid: selectStudent.current.studentID
            }

            if (!existingResult) {
                await resultService.createResult(newGrade);
                toast({
                    description: `Thêm bảng điểm của sinh viên thành công.`,
                    status: "success"
                });
            } else {
                await resultService.updateResult(existingResult.resultid, newGrade);
                toast({
                    description: `Cập nhật bảng điểm của sinh viên thành công.`,
                    status: "success"
                });
            }
            await fetchResultsByStudentId(selectStudent.current.studentID)
        } catch (error) {
            toast({
                description: `Thêm điểm viên thất bại`,
                status: "error"
            });
        }
    };

    const handleFilterGrade = () => {
        const grades = [];
        const resultFilter = results.filter(result => {
            const isYearValid = selectStudent.current.filterYear && result.year.includes(selectStudent.current.filterYear);
            const isSemesterValid = selectStudent.current.filterSemester && result.semester.includes(selectStudent.current.filterSemester);
            return isYearValid && isSemesterValid;
        });

        resultFilter.forEach(item => {
            item.content.split(", ").forEach(subject => {
                const [course, score] = subject.split(": ");
                grades.push({
                    course: course.trim(),
                    grade: score.trim(),
                });
            });
        });
        setStudentGrades(grades);
    };

    const filteredStudents = students.filter(student =>
        (student.studentname.toLowerCase().includes(searchStudent.toLowerCase()) ||
            String(student.studentid) === searchStudent) &&
        (!filterDepartId || student.classsd.department.depid === parseInt(filterDepartId)) &&
        (!filterClassId || student.classsd.classid === parseInt(filterClassId))
    );

    const filteredClassesTable = classes.filter(classItem =>
        classItem.department.depid === parseInt(filterDepartId)
    );

    return (
        <div className="p-4">
            <h1 className="text-xl text-center font-bold my-6">QUẢN LÝ ĐIỂM CỦA SINH VIÊN</h1>
            <div className="flex justify-between w-3/5 mx-auto my-6">
                <div className="flex gap-1">
                    <h2 className="font-bold">Tên sinh viên:</h2>
                    <p>{selectStudent.current.studentName}</p>
                </div>
                <div className="flex gap-1">
                    <h2 className="font-bold">Lớp:</h2>
                    <p>{selectStudent.current.studentClasses}</p>
                </div>
                <div className="flex gap-1">
                    <h2 className="font-bold">Năm học:</h2>
                    <p>{selectStudent.current.filterYear}</p>
                </div>
                <div className="flex gap-1">
                    <h2 className="font-bold">Học kì:</h2>
                    <p>{selectStudent.current.filterSemester}</p>
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex flex-col w-2/5">
                    <div className="flex items-center justify-center mb-4 gap-4">
                        <p className="font-bold">Lọc:</p>
                        <Select
                            variant='outline'
                            placeholder='Chọn khoa'
                            w="40%"
                            defaultValue={filterClassId}
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
                        <Input
                            variant='outline'
                            placeholder='Tìm kiếm lớp...'
                            value={searchStudent}
                            onChange={(e) => setSearchStudent(e.target.value)}
                            w="30%"
                        />
                    </div>
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Họ Tên</th>
                                <th className="border p-2">Lớp</th>
                                <th className="border p-2">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.studentid} className="hover:bg-gray-50">
                                    <td className="border p-1 text-sm text-center">{student.studentid}</td>
                                    <td className="border p-1 text-sm truncate">{student.studentname}</td>
                                    <td className="border p-1 text-sm truncate text-center">{student.classsd.classname}</td>
                                    <td className="border p-1 text-center">
                                        <Button colorScheme='blue'
                                            onClick={() => handleStudentSelect(student)} size="sm">
                                            Chọn
                                            <RiArrowRightCircleLine className="ml-2 size-5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col w-3/5 min-h-[50vh]">
                    <div className="flex items-center justify-center mb-4 gap-4">
                        <p className="font-bold">Lọc:</p>
                        <Select
                            variant='outline'
                            placeholder='Chọn năm học'
                            w="30%"
                            value={selectStudent.current.filterYear || ''}
                            onChange={(e) => {
                                selectStudent.current.filterYear = e.target.value
                                handleFilterGrade();
                            }}
                        >
                            {yearsArrayRef.current.map((years, index) => (
                                <option key={index} value={years}>{years}</option>
                            ))}
                        </Select>
                        <Select
                            variant='outline'
                            placeholder='Chọn học kì'
                            w="30%"
                            value={selectStudent.current.filterSemester || ''}
                            onChange={(e) => {
                                selectStudent.current.filterSemester = e.target.value;
                                handleFilterGrade();
                            }}
                        >
                            <option value="Học kì 1">Học kì 1</option>
                            <option value="Học kì 2">Học kì 2</option>
                            <option value="Hè">Hè</option>
                        </Select>
                        <Button colorScheme="blue" className="ml-4 w-fit"
                            onClick={() => {
                                selectStudent.current.studentGrade = "";
                                selectStudent.current.studentCourse = "";
                                setIsEditMode(false);
                                setErrors({});
                                onModalOpen();
                            }}
                        >
                            <RiAddCircleLine className="mr-2 size-6" />
                            Thêm điểm
                        </Button>
                    </div>

                    <table className="border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Môn</th>
                                <th className="border p-2">Điểm</th>
                                <th className="border p-2">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentGrades.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-1 text-center">{item.course}</td>
                                    <td className="border p-1 text-center">{item.grade}</td>
                                    <td className="border p-1 text-center">
                                        <Button colorScheme="orange" className="w-fit"
                                            onClick={() => {
                                                setIsEditMode(true);
                                                selectGradeIndex.current = index;
                                                handleEditGrade(item);
                                            }}>
                                            <RiEditBoxLine className="mr-2 size-5" />
                                            Sửa
                                        </Button>
                                        <Button colorScheme="red" className="ml-1 w-fit"
                                            onClick={() => {
                                                selectGradeIndex.current = index;
                                                onAlertOpen();
                                            }}>
                                            <RiDeleteBin6Line className="mr-2 size-5" />
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Button colorScheme="blue" className="mr-6 w-fit mt-auto ml-auto" onClick={handleSaveGrade} >
                        <RiSave3Line className="mr-2 size-5" />
                        Lưu
                    </Button>
                </div>
                {/* Modal nhập điểm */}
                <Modal isOpen={isModalOpen} onClose={onModalClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader className="text-center">
                            {isEditMode ? "Cập Nhật Sinh Viên" : "Thêm Sinh Viên"}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl isInvalid={errors.studentCourse}>
                                <FormLabel>Môn học</FormLabel>
                                <Input
                                    placeholder="Nhập môn học"
                                    defaultValue={selectStudent.current.studentCourse}
                                    onChange={e => selectStudent.current.studentCourse = e.target.value.trim()}
                                />
                                {errors.studentCourse && (
                                    <FormErrorMessage>{errors.studentCourse}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl mt={4} isInvalid={errors.studentGrade}>
                                <FormLabel>Điểm</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="Nhập điểm"
                                    defaultValue={selectStudent.current.studentGrade}
                                    onChange={e => selectStudent.current.studentGrade = e.target.value.trim()}
                                />
                                {errors.studentGrade && (
                                    <FormErrorMessage>{errors.studentGrade}</FormErrorMessage>
                                )}
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleAddOrEditGrade}>
                                {isEditMode ? "Cập nhật" : "Thêm"}
                            </Button>
                            <Button onClick={onModalClose}>Hủy</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <AlertComponent
                    isOpen={isAlertOpen}
                    onClose={onAlertClose}
                    callback={handleDeleteGrade}
                    message="Bạn có chắc chắn muốn xóa sinh viên này?"
                />
            </div>
        </div>
    );
};

export default ResultComponent;
