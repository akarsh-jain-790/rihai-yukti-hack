"use client";

import type React from "react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Scale, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/toaster";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    barCouncilNumber: "",
    courtId: "",
  });

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    // Validate role-specific fields
    if (formData.role === "lawyer" && !formData.barCouncilNumber) {
      addToast({
        title: "Error",
        description: "Bar Council Number is required for advocates",
        type: "error",
      });
      return;
    }

    if (formData.role === "judge" && !formData.courtId) {
      addToast({
        title: "Error",
        description: "Court ID is required for judges",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formData);
      addToast({
        title: "Success",
        description: "Your account has been created successfully",
        type: "success",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      addToast({
        title: "Registration Failed",
        description:
          error.response?.data?.msg ||
          "Failed to create account. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthText = ["", "Weak", "Fair", "Good", "Strong"][strength];

    return { strength, text: strengthText };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Scale className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Password strength:</span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength <= 1
                          ? "text-red-500"
                          : passwordStrength.strength === 2
                          ? "text-yellow-500"
                          : passwordStrength.strength === 3
                          ? "text-green-500"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength.strength <= 1
                          ? "bg-red-500"
                          : passwordStrength.strength === 2
                          ? "bg-yellow-500"
                          : passwordStrength.strength === 3
                          ? "bg-green-500"
                          : "bg-green-600"
                      }`}
                      style={{
                        width: `${(passwordStrength.strength / 4) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs gap-1">
                      <CheckCircle
                        className={`h-3 w-3 ${
                          /[A-Z]/.test(formData.password)
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>Capital letter</span>
                    </div>
                    <div className="flex items-center text-xs gap-1">
                      <CheckCircle
                        className={`h-3 w-3 ${
                          /[0-9]/.test(formData.password)
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>Number</span>
                    </div>
                    <div className="flex items-center text-xs gap-1">
                      <CheckCircle
                        className={`h-3 w-3 ${
                          formData.password.length >= 8
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center text-xs gap-1">
                      <CheckCircle
                        className={`h-3 w-3 ${
                          /[^A-Za-z0-9]/.test(formData.password)
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lawyer">Advocate</SelectItem>
                  <SelectItem value="judge">Judge</SelectItem>
                  <SelectItem value="user">Client</SelectItem>
                  <SelectItem value="researcher">Legal Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "lawyer" && (
              <div className="space-y-2">
                <Label htmlFor="barCouncilNumber">Bar Council Number</Label>
                <Input
                  id="barCouncilNumber"
                  placeholder="e.g., MAH/12345/2020"
                  value={formData.barCouncilNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {formData.role === "judge" && (
              <div className="space-y-2">
                <Label htmlFor="courtId">Court ID</Label>
                <Input
                  id="courtId"
                  placeholder="e.g., DC-DEL-123"
                  value={formData.courtId}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="relative my-3 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Microsoft
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
