import Swal from "sweetalert2";

export const showToast = ({ icon, title, text }) => {
  return Swal.fire({
    toast: true,
    position: "bottom-end",
    icon: icon || "success",
    title: title || "",
    text: text || "",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,

    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};