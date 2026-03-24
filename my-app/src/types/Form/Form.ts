export interface FormProps {
  FormType: "Login" | "Register";
}

export interface validationProcessProps {
  email:string;
  username?:string;
  password: string | number | any;
}