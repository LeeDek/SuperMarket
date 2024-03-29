import React, { useState } from "react";
import "./Register.scss";
import { User } from "../../rami-types";
import registerAPI from "../../features/api/usersAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RegisterProps {
  onClose: () => void;
}
const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const initialUserState: User = {
    user_id: null,
    email: "",
    id_number: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    role_id: 2,
    role_name: "user",
    addresses: [],
    phone_number: "",
    gender: "",
    birth_date: "",
  };

  const [newUser, setNewUser] = useState<User>(initialUserState);
  const [passwordValidation, setPasswordValidation] = useState<string | null>(
    null
  );
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<
    string | null
  >(null);
  const [IDValidation, setIDValidation] = useState<string | null>(null);
  const [emailValidation, setEmailValidation] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Add state for showing password

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
    if (name === "confirm_password") {
      setConfirmPasswordValidation(validateConfirmPassword(value));
    }
    if (name === "id_number") {
      setIDValidation(validateIsraeliID(value));
    }
    if (name === "email") {
      setEmailValidation(validateEmail(value));
    }
  };

  const validateIsraeliID = (idNumber: string) => {
    if (/^\d{9}$/.test(idNumber)) {
      return null;
    } else {
      return "מספר תעודת הזהות הישראלית אינו תקין";
    }
  };

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    if (newUser.password === newUser.confirm_password) {
      return null;
    }
    if (regex.test(password)) {
      return null;
    } else {
      return "הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד";
    }
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (newUser.password === confirmPassword) {
      return null;
    } else {
      return "הסיסמאות אינן תואמות";
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : "כתובת הדואר האלקטרוני אינה תקינה";
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState); // Toggle the state
  };

  const handelRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // validate password
      if (passwordValidation || confirmPasswordValidation) {
        toast.info(
          "הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר"
        );
        return;
      }

      // validate ID
      if (IDValidation) {
        toast.error("מספר תעודת הזהות הישראלית אינו תקין");
        return;
      }

      // validate email
      if (emailValidation) {
        toast.error("כתובת הדואר האלקטרוני אינה תקינה");
        return;
      }

      // if all fields are valid
      const resultAction: any = await registerAPI(newUser);
      if (resultAction.ok) {
        toast.success("ההרשמה בוצעה בהצלחה");
        // Call the sendEmail endpoint
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: newUser.email,
            subject: "הרשמה לאתר רמי לוי",
            text: "תודה על הרשמתך לאתר רמי לוי",
          }),
        });

        if (response.ok) {
          console.log("Email sent successfully");
        } else {
          console.error("Failed to send email:", response.statusText);
        }
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-main">
      <svg
        onClick={onClose}
        data-v-2d7301cc=""
        aria-label="סגור"
        xmlns="http://www.w3.org/2000/svg"
        width="30px"
        height="30px"
        fill="none"
        viewBox="0 0 24 24"
        className="exit-reg-svg"
        stroke="currentColor"
      >
        <path
          data-v-2d7301cc=""
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
      <h1 className="register-title">
        <svg
          data-v-c9960dd8=""
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="22.58"
          height="24.52"
          viewBox="0 0 22.58 24.52"
          className="reg-svg"
        >
          <defs data-v-c9960dd8="">
            <clipPath
              data-v-c9960dd8=""
              id="a"
              transform="translate(-1.62 -0.65)"
            >
              <rect
                data-v-c9960dd8=""
                width="25.82"
                height="25.82"
                fill="none"
              ></rect>
            </clipPath>
          </defs>
          <circle
            data-v-c9960dd8=""
            cx="10.93"
            cy="6.15"
            r="5.65"
            fill="none"
            stroke="#0079f2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></circle>
          <path
            data-v-c9960dd8=""
            d="M12.55,24.67a14.74,14.74,0,0,0,9.71-3.89,2.21,2.21,0,0,0,.33-2.85,11.94,11.94,0,0,0-20.16.13,2.14,2.14,0,0,0,.41,2.71A14.68,14.68,0,0,0,12.55,24.67Z"
            transform="translate(-1.62 -0.65)"
            fill="none"
            stroke="#0079f2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <line
            data-v-c9960dd8=""
            x1="17.22"
            y1="2.93"
            x2="22.08"
            y2="2.93"
            fill="none"
            stroke="#0079f2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></line>
          <line
            data-v-c9960dd8=""
            x1="19.65"
            y1="0.5"
            x2="19.65"
            y2="5.37"
            fill="none"
            stroke="#0079f2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></line>
        </svg>
        הרשמה
      </h1>
      <form className="register-form" onSubmit={handelRegister}>
        <input
          type="text"
          placeholder="שם פרטי*"
          name="first_name"
          id="first_name"
          value={newUser.first_name}
          onChange={handleInputChange}
          required
          dir="rtl"
          style={{ textAlign: "right" }}
        />
        <input
          type="text"
          placeholder="שם משפחה*"
          name="last_name"
          id="last_name"
          value={newUser.last_name}
          onChange={handleInputChange}
          required
          dir="rtl"
          style={{ textAlign: "right" }}
        />
        <input
          type="email"
          placeholder="דואר אלקטרוני*"
          name="email"
          id="email"
          value={newUser.email}
          onChange={handleInputChange}
          required
          title="הכנס כתובת מייל נכונה"
          dir="rtl"
          style={{ textAlign: "right" }}
        />

        {emailValidation && (
          <div className="error-message">{emailValidation}</div>
        )}
        <div className="reg-pass-wrapper">
          <button
            className="show-password-btn"
            type="button"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <svg
                data-v-91686126=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="25.47"
                height="8.57"
                viewBox="0 0 25.47 8.57"
                class="stroke-width-1"
              >
                <defs data-v-91686126="">
                  <clipPath
                    data-v-91686126=""
                    id="a"
                    transform="translate(-1.7 -10.15)"
                  >
                    <rect
                      data-v-91686126=""
                      width="28.87"
                      height="28.87"
                      fill="none"
                    ></rect>
                  </clipPath>
                </defs>
                <path
                  data-v-91686126=""
                  d="M2.2,17C9,8.52,19.91,8.52,26.67,17h0"
                  transform="translate(-1.7 -10.15)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <circle
                  data-v-91686126=""
                  cx="12.74"
                  cy="4.29"
                  r="3.79"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></circle>
              </svg>
            ) : (
              <svg
                data-v-91686126=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="25.47"
                height="14.73"
                viewBox="0 0 25.47 14.73"
                class="stroke-width-1"
              >
                <defs data-v-91686126="">
                  <clipPath
                    data-v-91686126=""
                    id="a"
                    transform="translate(-1.7 -7.07)"
                  >
                    <rect
                      data-v-91686126=""
                      width="28.87"
                      height="28.87"
                      fill="none"
                    ></rect>
                  </clipPath>
                </defs>
                <path
                  data-v-91686126=""
                  d="M11.07,11.07A16.46,16.46,0,0,0,2.2,17"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  data-v-91686126=""
                  d="M11.77,11.77a3.73,3.73,0,0,0-1.12,2.67A3.77,3.77,0,0,0,17.1,17.1"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <line
                  data-v-91686126=""
                  x1="19.6"
                  y1="14.23"
                  x2="5.87"
                  y2="0.5"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></line>
                <path
                  data-v-91686126=""
                  d="M18.07,15.41a3.45,3.45,0,0,0,.15-1,3.79,3.79,0,0,0-3.79-3.79,3.45,3.45,0,0,0-1,.15"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  data-v-91686126=""
                  d="M26.67,17c-3.65-4.59-8.52-6.69-13.3-6.32"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            )}
          </button>
          <input
            type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
            placeholder="סיסמה*"
            name="password"
            id="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
            dir="rtl"
            style={{ textAlign: "right" }}
          />
          {passwordValidation && (
            <div className="error-message">{passwordValidation}</div>
          )}
        </div>
        <div className="reg-confirm-wrapper">
          <button
            className="show-con-password-btn"
            type="button"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <svg
                data-v-91686126=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="25.47"
                height="8.57"
                viewBox="0 0 25.47 8.57"
                class="stroke-width-1"
              >
                <defs data-v-91686126="">
                  <clipPath
                    data-v-91686126=""
                    id="a"
                    transform="translate(-1.7 -10.15)"
                  >
                    <rect
                      data-v-91686126=""
                      width="28.87"
                      height="28.87"
                      fill="none"
                    ></rect>
                  </clipPath>
                </defs>
                <path
                  data-v-91686126=""
                  d="M2.2,17C9,8.52,19.91,8.52,26.67,17h0"
                  transform="translate(-1.7 -10.15)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <circle
                  data-v-91686126=""
                  cx="12.74"
                  cy="4.29"
                  r="3.79"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></circle>
              </svg>
            ) : (
              <svg
                data-v-91686126=""
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="25.47"
                height="14.73"
                viewBox="0 0 25.47 14.73"
                class="stroke-width-1"
              >
                <defs data-v-91686126="">
                  <clipPath
                    data-v-91686126=""
                    id="a"
                    transform="translate(-1.7 -7.07)"
                  >
                    <rect
                      data-v-91686126=""
                      width="28.87"
                      height="28.87"
                      fill="none"
                    ></rect>
                  </clipPath>
                </defs>
                <path
                  data-v-91686126=""
                  d="M11.07,11.07A16.46,16.46,0,0,0,2.2,17"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  data-v-91686126=""
                  d="M11.77,11.77a3.73,3.73,0,0,0-1.12,2.67A3.77,3.77,0,0,0,17.1,17.1"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <line
                  data-v-91686126=""
                  x1="19.6"
                  y1="14.23"
                  x2="5.87"
                  y2="0.5"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></line>
                <path
                  data-v-91686126=""
                  d="M18.07,15.41a3.45,3.45,0,0,0,.15-1,3.79,3.79,0,0,0-3.79-3.79,3.45,3.45,0,0,0-1,.15"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  data-v-91686126=""
                  d="M26.67,17c-3.65-4.59-8.52-6.69-13.3-6.32"
                  transform="translate(-1.7 -7.07)"
                  fill="none"
                  stroke="#0079f2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            )}
          </button>
          <input
            type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
            placeholder="אישור סיסמה*"
            name="confirm_password"
            id="confirm_password"
            value={newUser.confirm_password}
            onChange={handleInputChange}
            dir="rtl"
            style={{ textAlign: "right" }}
          />
          {confirmPasswordValidation && (
            <div className="error-message">{confirmPasswordValidation}</div>
          )}
        </div>
        <input
          type="text"
          placeholder="תעודת זהות*"
          name="id_number"
          id="id_number"
          value={newUser.id_number}
          onChange={handleInputChange}
          required
          dir="rtl"
          style={{ textAlign: "right" }}
        />
        {IDValidation && <div className="error-message">{IDValidation}</div>}
        <div className="reg-disclaimers">
          <p>
            הנני מאשר/ת את תקנון אתר רמי לוי באינטרנט המחודש ואת הצטרפותי ללא
            עלות למועדון לקוחות רמי לוי בכפוף לתקנון המועדון *
          </p>
          <p>
            הנני מאשר/ת לקבל הטבות, מבצעים, עדכונים והצעות למוצרים ושירותים
            מקבוצת רמי לוי באמצעי התקשורת שמסרתי לקבוצה. ידוע לי כי אוכל לחזור
            בי מהסכמתי בכל עת.
          </p>
        </div>
        <div>
          <button className="register-cancel" onClick={onClose}>
            ביטול
          </button>
          <button className="register-btn" type="submit">
            קחו אותי לסופר!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
