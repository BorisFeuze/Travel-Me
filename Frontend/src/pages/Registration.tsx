import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import {Users, User} from "@/library";

// ---- helpers from mock ----
const countryOptions = Array.from(new Set(Users.map(u => u.country))).sort();

//----schema for mockUser----
const Registration = z.object => ({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  age: z.coerce.number().int().min(16, "16+"),
  continent: z.string().min(1, "Required"),
  country: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  gender: z.custome<Gender>({message:"select one"}),
  phone: z.string().min(5, "too short"),
  pictureURL: z.string().url("Invalid URL").optional().or(z.literal("")),
  role: z.enum(["Volunteer", "Host"]).optional(),
  skills: z.string().optional(),
  languages: z.string().optional(),
  educations: z.string().optional(),
});

type RegistrationInput = z.infer<typeof RegistrationSchema>;

function toList(s?: string): string[] {
  if (!s) return [];
  return s.split(",").map(v => v.trim()).filter(Boolean);
}


const Registration() => {
  
}

  return (
    <div>
      <h1>Registration Page</h1>
    </div>
  );
};

export default Registration;
