import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import Swal from "sweetalert2";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import Button from "react-bootstrap/Badge";

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
  email: "",
  password: "",
};

if (process.env.NODE_ENV === "development") {
  initialValues.username = "admin";
  initialValues.password = "@Admin1234!";
}

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
    password: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(() => {
        login(values.username, values.password)
          .then((response) => {
            console.log(response, "response");
            if (
              response.data.status === 200 &&
              response.data.data.forcePassword === "Y"
            ) {
              Swal.fire({
                title: "info!",
                text: `Please Reset Your Password first!`,
                icon: "info",
                heightAuto: false,
                confirmButtonText: "Ok",
              }).then((result) => {
                dispatch(props.logout());

                const data = values;
                Object.assign(data, { userId: response.data.data.userId });

                console.log(data, "data");

                history.push("/auth/reset-password", { params: data });
              });
            } else if (response.data.status === 200) {
              console.log("masuk sukses");

              // disableLoading();
              const token = response.data.data.token;
              props.login(token);
              setSubmitting(true);
            } else {
              console.log("masuk else");
              Swal.fire({
                title: "Error!",
                text: `${response.data.message}`,
                icon: "error",
                heightAuto: false,
                confirmButtonText: "Ok",
              }).then((result) => {
                disableLoading();
                setSubmitting(false);
              });
            }
          })
          .catch((error) => {
            console.log(error, "error");
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN",
              })
            );
          })
          .finally(() => {});
      }, 1000);
    },
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your username and password
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {/* {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
            <div className="alert-text ">
              Use account <strong>admin@demo.com</strong> and password{" "}
              <strong>demo</strong> to continue.
            </div>
          </div>
        )} */}

        <div className="form-group fv-plugins-icon-container">
          <input
            type="hidden"
            name="__RequestVerificationToken"
            value={`${initialValues.requestVerificationToken}`}
            {...formik.getFieldProps("requestVerificationToken")}
          />
          <input
            placeholder="Username"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "username"
            )}`}
            name="username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.username}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#e8f0fe",
            }}
          >
            <input
              placeholder="Password"
              type={passwordShown ? "text" : "password"}
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            <Button style={{ backgroundColor: "#e8f0fe", cursor: "pointer" }}>
              <i className="flaticon-eye" onClick={togglePasswordVisiblity}></i>
            </Button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-center align-items-center">
          <Link
            to="/auth/send-email"
            className="text-dark-50 text-hover-danger my-3 mr-9"
            id="kt_login_forgot"
          >
            <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span>Login</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
