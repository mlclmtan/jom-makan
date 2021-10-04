import {
  Button,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { EditIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { updateRemark } from "../lib/db";
import { showToast } from "../lib/Helper/Toast";
import { differenceInSeconds } from "date-fns";

const EditRemarkButton = ({ order_date, jom, jom_id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmtting },
  } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    const remark = {
      ...jom,
      remark: data.remark,
    };
    if (differenceInSeconds(order_date, new Date()) > 0) {
      // console.log(differenceInSeconds(order_date, new Date()));
      await updateRemark(jom_id, remark);
      showToast(
        toast,
        "Remark Edited Successful!",
        "Your Remark has been edited successfully",
        "success",
        5000,
        true
      );
      onClose();
      reset();
    } else {
      // console.log(differenceInSeconds(order_date, new Date()));
      showToast(
        toast,
        "Remark Cannot Be Edited After Order Closed!",
        "Please edit the your jom remark before the order closed.",
        "error",
        5000,
        true
      );
    }

    // await updateRemark(jom_id, remark);
    // showToast(
    //   toast,
    //   "Remark Edited Successful!",
    //   "Your Remark has been edited successfully",
    //   "success",
    //   5000,
    //   true
    // );
    // onClose();
    // reset();
  };

  return (
    <>
      <Button
        variant="unstyled"
        onClick={onOpen}
        disabled={differenceInSeconds(order_date, new Date()) < 0}
      >
        <EditIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Edit Remark</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={errors.remark}>
                <FormLabel>Remark</FormLabel>
                <Textarea
                  id="remark"
                  placeholder="Edit Your Remark Here"
                  {...register("remark", {
                    require: "Remark is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.remark && errors.remark.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Change</Button>
              <Button onClick={onClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>{" "}
    </>
  );
};

export default EditRemarkButton;
