import {
    Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
    AlertDialogFooter, AlertDialogBody
} from "@chakra-ui/react";

const AlertComponent = ({ title, callback, isOpen, onClose, message, size, buttonClose, buttonAction }) => {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} size={size}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title ? title : "Xác nhận xóa"}
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        {message}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            {buttonClose ? buttonClose : "Hủy"}
                        </Button>
                        <Button colorScheme={buttonAction ? "blue" : "red"} onClick={callback} ml={3}>
                            {buttonAction ? buttonAction : "Xóa"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default AlertComponent;
