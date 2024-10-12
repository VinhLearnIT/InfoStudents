import React, { useRef, useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Alert, AlertIcon, Spinner, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import * as studentService from "../services/studentsService";

const LoginPage = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (!email || !password) {
            setError('Email và mật khẩu không được để trống');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);
            const response = await studentService.loginStudent(formData);

            if (response.status === 200) {
                sessionStorage.setItem('user', JSON.stringify(response.data));
                navigate('/admin/student');
            } else if (response.status === 404) {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi đăng nhập.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.100">
            <Box bg="white" p={8} rounded="lg" shadow="md" w="full" maxW="md">
                <Heading as="h2" size="xl" textAlign="center" mb={6}>Đăng nhập</Heading>

                {error && (
                    <Alert status="error" mb={4}>
                        <AlertIcon />
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <FormControl id="email" mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="Nhập email" ref={emailRef} />
                    </FormControl>

                    <FormControl id="password" mb={6}>
                        <FormLabel>Mật khẩu</FormLabel>
                        <Input type="password" placeholder="Nhập mật khẩu" ref={passwordRef} />
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        disabled={isLoading}
                        leftIcon={isLoading ? <Spinner size="sm" /> : null}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
