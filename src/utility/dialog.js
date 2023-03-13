import Swal from "sweetalert2";

export const showSuccessDialog = (message) =>
  Swal.fire({
    title: "Success",
    text: message,
    icon: "success",
    confirmButtonText: "OK",
  });

export const showErrorDialog = (message) =>
  Swal.fire({
    title: "Error",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
  });

export const showDialog = (
  message,
  title = "Info",
  icon = "info",
  confirmText = "OK"
) =>
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    confirmButtonText: confirmText,
  });

export const showConfirmDialog = (message) =>
  Swal.fire({
    title: "Confirm",
    text: message,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "primary",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  });

export const showDeleteDialog = (message) =>
  Swal.fire({
    title: "Delete",
    html: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "red",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });
