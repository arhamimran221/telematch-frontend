"use client";
import { useState } from "react";
import { z } from "zod";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { signupUser } from "../app/services/register-user"; // Import the signup API call
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  terms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

const SignupForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      schema.parse(formValues);
      setErrors({});
      setIsSubmitting(true);

      // Call the API to sign up the user
      const response = await signupUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });

      console.log("User signed up successfully:", response);
      if (response.userId) {
        localStorage.setItem("myID", response.userId);
        localStorage.setItem("userName", formValues.name);
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc, curr) => {
          if (curr.path[0]) {
            acc[curr.path[0]] = curr.message;
          }
          return acc;
        }, {});
        setErrors(newErrors);
      } else {
        console.error("Error during sign up:", err);
        setErrors({ apiError: "Failed to sign up. Please try again later." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[90%] m-auto h-[100vh] flex flex-col justify-center items-center">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Welcome to telematch! Enter your details to register.
        </Typography>
        <form
          className="mt-8 mb-2 w-full max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              placeholder="John Doe"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
                errors.name ? "border-red-500" : ""
              }`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.name && (
              <p className="text-red-500 italic text-[13px] mt-[-15px]">
                {errors.name}
              </p>
            )}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
                errors.email ? "border-red-500" : ""
              }`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.email && (
              <p className="text-red-500 italic text-[13px] mt-[-15px]">
                {errors.email}
              </p>
            )}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
                errors.password ? "border-red-500" : ""
              }`}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            {errors.password && (
              <p className="text-red-500 italic text-[13px] mt-[-15px]">
                {errors.password}
              </p>
            )}
          </div>
          <div className="mb-4 flex items-center">
            <Checkbox
              name="terms"
              checked={formValues.terms}
              onChange={handleChange}
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal mt-[4px]"
            >
              I agree to the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          </div>
          {errors.terms && (
            <p className="text-red-500 italic text-[13px] mt-[-15px]">
              {errors.terms}
            </p>
          )}

          {errors.apiError && (
            <p className="text-red-500 italic text-[13px] mt-2">
              {errors.apiError}
            </p>
          )}

          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <Link href="/signin" className="font-bold text-gray-900">
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
};

export default SignupForm;
