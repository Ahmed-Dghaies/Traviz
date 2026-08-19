import { scope } from "arktype";

import { doesPasswordFitRequirements } from "../utils";

const signUpScope = scope({
  "#password": () =>
    signUpScope.type("string>7").narrow((value, ctx) => {
      const { isValid } = doesPasswordFitRequirements(value);

      if (!isValid) {
        return ctx.reject({
          actual: "",
          expected:
            "must contain at least 3 of the following: uppercase letter, lowercase letter, digit, special character",
        });
      }
      return true;
    }),
  "#passwordWithConfirmation": () =>
    signUpScope
      .type({
        password: "password",
        confirmPassword: "string",
      })
      .narrow((value, ctx) => {
        if (value.password !== value.confirmPassword) {
          return ctx.reject({
            message: "Passwords do not match",
            path: ["passwordWithConfirmation.confirmPassword"],
          });
        }
        return true;
      }),
  fullSchema: () =>
    signUpScope
      .type({
        fullName: "string>0",
        email: "string.email",
        passwordWithConfirmation: "passwordWithConfirmation",
      })
      .pipe((value) => {
        return {
          fullName: value.fullName,
          email: value.email,
          password: value.passwordWithConfirmation.password,
        };
      }),
});

const SignUpSchema = signUpScope.export().fullSchema;

export default SignUpSchema;
export type SignUpSchemaIn = typeof SignUpSchema.inferIn;
export type SignUpSchemaOut = typeof SignUpSchema.inferOut;
